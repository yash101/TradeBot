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

				uint64_t& count_elements();
				uint64_t& first_block_pointer();
				uint64_t& first_empty_pointer();
				char* raw();
				size_t raw_size();

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

				uint64_t& next();
				uint64_t& down();
				uint64_t& key();
				char* raw();
				size_t raw_size();

			};

			/** \brief Garbage block - represents a void in a database file
			*/
			class EmptyBlock
			{

			private:

				uint64_t data[2];	//< data[0]: pointer to the next empty block; data[1]: length of this garbage block 16 bytes for block header

			public:

				EmptyBlock();

				uint64_t& next();
				uint64_t& length();

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

				void set_data(void* ptr, size_t bytes);
				char* raw();
				size_t raw_size();

			};


			FILE* file;		//< file pointer used by CSTDIO

		protected:

			void seek(size_t position);
			void seek_end();
			void seek_beg();
			size_t get_position();
			size_t get_size(); #error "TODO: Not implemented yet"

		public:

			SkipListDB();
			~SkipListDB();

			void open_db(const char* filepath);

			void insert(std::vector<SkipListEntry> entries);
			std::vector<SkipListEntry> retrieve(long lowerbound, long upperbound);

		};
	}
}

#endif
