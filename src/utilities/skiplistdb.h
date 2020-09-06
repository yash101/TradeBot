#ifndef _SKIPLISTDB_H
#define _SKIPLISTDB_H

#include <cstdio>
#include <vector>
#include <cstdint>

namespace tb
{
	namespace db
	{
		/** \brief key-value pairs that are used with the SkipListDB
		*/
		struct SkipListEntry
		{
		public:

			int64_t key;	//< the key that is used to index the blob
			void* item;		//< binary blob to be stored
			size_t size;	//< length of binary blob in bytes
		};


		/** \brief A key-value pair storage database
		* 
		* Data is stored in a skip list. This means O(lg(n)) time complexity for insertion, searching and insertion
		* 
		* Iteration is O(lg(n)) for the starting element, O(1) for each element after that, or O(m) where m is the number of elements being iterated over
		* 
		* There are four types of blocks in a database file:
		*
		* 1. Metadata - stored at the beginning of the file. Contains the number of elements stored in the database and a pointer to the root element
		*	- [8] Number of elements
		*	- [8] Pointer to root element
		*	- [8] Pointer to the first empty block, or 0 if there is none
		* 2. Pointer Block - contains a next and down pointer to build the skip list
		*	- [8] Next
		*	- [8] Down; MSB = 0 if the next node is a pointer block; MSB = 1 if the next node is a data block
		*	- [8] Key
		* 3. Data Block - contains a blob size, followed by the binary data
		*	- [8] Size
		*	- [Size] data
		* 4. Empty Block - Contains a pointer to the next block, followed by the amount of free space
		*	- [8] Next empty block (or 0 for end)
		*	- [8] Length of empty block
		* 
		* \todo everything quite literally
		*/
		class SkipListDB
		{
		private:

			/** \brief Metadata block for the SkipListDB
			*/
			class Metadata
			{
				
			private:

				uint64_t data[3];	//< data[0] = count of elements; data[1] = pointer to the first useful block; data[2] = pointer to the first empty block; note: all of these values are initialized to 0 as NULL

			public:

				Metadata();

				/** \brief returns the number of elements in the database
				* \return number of elements in the database
				*/
				uint64_t&
				count_elements();


				/** \brief pointer to the first pointer block in the database
				* \return byte offset from beginning of the file of the pointer block
				*
				* Initialized to zero as a null value - if there is no blocks.
				*/
				uint64_t&
				first_block_pointer();


				/** \brief pointer to the first empty block in the database
				* \return byte offset of the first empty block in the database
				*
				* Initialized to zero as a null value if there is no empty block.
				*/
				uint64_t&
				first_empty_pointer();


				/** \brief returns a pointer to a raw block that can be written into memory or a file
				* \return char array pointer with the data formatted for writing
				*
				* See ::raw_size() to get the length of this array
				*/
				char*
				raw();


				/** \brief returns the size of the raw data to be written to disk
				* \return the number of bytes required to store this block to disk
				*/
				size_t
				raw_size();

			};


			/** \brief Pointer block for the SkipListDB
			* 
			* Pointer blocks contain a next pointer, down pointer, and a key
			*/
			class PointerBlock
			{

			private:

				uint64_t data[3];	//< data[0]: next pointer (points right); data[1]: down pointer (points down); data[2]: key

			public:

				PointerBlock();

				/** \brief returns the pointer to the next block in the horizontal linked list (skip list)
				* \return byte offset from beginning of file to the next block in the horizontal linked list
				*
				* Note: this is initialized to 0 as a null pointer
				*/
				uint64_t&
				next();


				/** \brief returns the pointer to the next block in the vertical linkied list (down list)
				* \return byte offset from beginning of file to the next block in the vertical linked list
				*
				* Note: initialized to 0 as a null pointer
				*/
				uint64_t&
				down();


				/** \brief returns the key associated with the pointer block
				* \return 64 bit key of the pointer block
				*/
				uint64_t&
				key();


				/** \brief returns a raw character pointer (array) with the raw data ready to be read from or written to disk or backing storage
				* \return char pointer
				*
				* Note: do not free the returned pointer
				*/
				char*
				raw();


				/** \brief returns the size of the raw character array in bytes so the data can be written to or read from disk
				* \return bytes required for the read or write
				*/
				size_t
				raw_size();

			};

			/** \brief Garbage block - represents a void in a database file
			*/
			class EmptyBlock
			{

			private:

				uint64_t data[2];	//< data[0]: pointer to the next empty block; data[1]: length of this garbage block 16 bytes for block header

			public:

				EmptyBlock();


				/** \brief returns the pointer to the next empty block (byte offset from beginning of the file)
				* \return byte offset to the next empty block (0 if none exist)
				*/
				uint64_t&
				next();


				/** \brief returns the length of the void in the database file
				* \return length of contiguous free space in the database file in bytes
				*/
				uint64_t&
				length();

			};

			/** \brief Holds a piece of data and its size
			* 
			* /todo: revise this class and build it
			*/
			class DataBlock
			{

			private:

				uint64_t data[2];	//< data[0]: size of data block; data[1]: key of data block
				char* ptr;			//< pointer to array that holds data

			public:

				DataBlock();
				virtual ~DataBlock();

				/** \brief inserts data into the data block
				* \param ptr is a pointer to data
				* \param bytes is the length of the data
				*
				* Note: the data in \param ptr is copied for memory management
				*/
				void
				set_data(void* ptr, size_t bytes);

				/** \brief returns a character array with a raw representation of the data on disk
				* \return char array with the raw representation of what the data looks like on disk
				*
				* Note: memory management is performed internally. Changing aspects of this object may invalidate this pointer.
				*/
				char*
				raw();


				/** \brief returns the length of the data block in the database file
				* \return length of the raw data block in the database file in bytes
				*/
				size_t
				raw_size();

			};


			FILE* file;		//< file pointer used by CSTDIO

		protected:

			/** \brief moves the cursor in the file to a new location (position)
			*
			* \param position is the location the cursor should be moved to
			*/
			void
			seek(size_t position);


			/** \brief moves the cursor in the file to the end of the file
			*/
			void
			seek_end();


			/** \brief moves the cursor in the file to the beginning of the file
			*/
			void
			seek_beg();


			/** \brief returns the position the file is pointing to
			*
			* \return position the file's cursor is at
			*/
			size_t
			get_position();

		public:

			SkipListDB();
			~SkipListDB();


			/** \brief loads a database file
			*
			* \param filepath is the location for the database file that should be opened
			*
			* The path to the file should exist already or this function will fail by throwing std::bad_alloc.
			*
			* The file will be created if it does not already exist.
			*
			* \todo finish this. currently just opens the file. should load the file too.
			*/
			void open_db(
				const char* filepath
			);


			/** \brief insert one or more entry into the database
			* \param entries is a vector of entries to insert
			*
			* Entries are sorted by the key before insertion. Entries are generally inserted contiguously.
			*
			* This function optimizes slightly and tries to insert data nodes linearly so they can be efficiently iterated over.
			*
			* \todo implement
			*/
			void
			insert(
				std::vector<SkipListEntry> entries
			);


			/** \brief retrieves entries between an lower and upper bound
			* \param lowerbound is an inclusive lowerbound for the keys that will be retrieved
			* \param upperbound is an inclusive upperbound for the keys that will be retrieved
			*
			* To retrieve just one value, you can set the upper- and lower-bounds equal to each other.
			*
			* Try to retrieve multiple contiguous elements with a single call. The initial search required O(lg(n)) time. Every subsequent element returned after that requires constant time.
			*
			* \return vector of entries
			* \todo implement
			*/
			std::vector<SkipListEntry>
			retrieve(
				long lowerbound,
				long upperbound
			);

		};
	}
}

#endif
