#include "skiplistdb.h"

#include <algorithm>
#include <memory>
#include <memory.h>
#include <stdexcept>


tb::db::SkipListDB::SkipListDB() :
	file(nullptr)
{
}


tb::db::SkipListDB::~SkipListDB()
{
	if (file != nullptr)
	{
		fclose(file);
		file = nullptr;
	}
}

void
tb::db::SkipListDB::seek(
	size_t position
)
{
	fseek(file, position, SEEK_SET);

	if (ftell(file) != position)
		throw std::bad_alloc();
}


void
tb::db::SkipListDB::seek_beg()
{
	fseek(file, 0, SEEK_SET);
}


void
tb::db::SkipListDB::seek_end()
{
	fseek(file, 0, SEEK_END);
}


size_t
tb::db::SkipListDB::get_position()
{
	return ftell(file);
}


void
tb::db::SkipListDB::open_db(
	const char* filepath
)
{
	if (file != nullptr)
		fclose(file);

	file = fopen(filepath, "rb+");
	seek_beg();	// will reset everything too

	if (file == NULL)
	{
		file = nullptr;
		throw std::bad_alloc();	// :(
	}
}


/** \brief compares keys to determine which is smaller
* \param a is one of the compared entries
* \param b is another compared entry
* 
* \return true if a.key < b.key
* 
* Useful for std::sort()
*/
static bool compare_entries(tb::db::SkipListEntry& a, tb::db::SkipListEntry& b)
{
	return a.key < b.key;
}


void
tb::db::SkipListDB::insert(
	std::vector<tb::db::SkipListEntry> entries
)
{
	// pre-sort so we are more likely to import elements contiguously
	std::sort(entries.begin(), entries.end(), compare_entries);
}


std::vector<tb::db::SkipListEntry>
tb::db::SkipListDB::retrieve(
	long lowerbound,
	long upperbound
)
{
	return std::vector<tb::db::SkipListEntry>();
}


tb::db::SkipListDB::Metadata::Metadata() :
	data{ 0 }
{
}


uint64_t&
tb::db::SkipListDB::Metadata::count_elements()
{
	return data[0];
}

uint64_t&
tb::db::SkipListDB::Metadata::first_block_pointer()
{
	return data[1];
}


uint64_t&
tb::db::SkipListDB::Metadata::first_empty_pointer()
{
	return data[2];
}


char*
tb::db::SkipListDB::Metadata::raw()
{
	return reinterpret_cast<char*>(data);
}


size_t
tb::db::SkipListDB::Metadata::raw_size()
{
	return sizeof(data);
}


tb::db::SkipListDB::PointerBlock::PointerBlock() :
	data{ 0 }
{
}


uint64_t&
tb::db::SkipListDB::PointerBlock::next()
{
	return data[0];
}


uint64_t&
tb::db::SkipListDB::PointerBlock::down()
{
	return data[1];
}


uint64_t&
tb::db::SkipListDB::PointerBlock::key()
{
	return data[2];
}


char*
tb::db::SkipListDB::PointerBlock::raw()
{
	return reinterpret_cast<char*>(data);
}


size_t
tb::db::SkipListDB::PointerBlock::raw_size()
{
	return sizeof(data);
}


tb::db::SkipListDB::EmptyBlock::EmptyBlock() :
	data{ 0 }
{
}


uint64_t&
tb::db::SkipListDB::EmptyBlock::next()
{
	return data[0];
}


uint64_t&
tb::db::SkipListDB::EmptyBlock::length()
{
	return data[1];
}


tb::db::SkipListDB::DataBlock::DataBlock() :
	data{ 0 }
{
}


tb::db::SkipListDB::DataBlock::~DataBlock()
{
}


void
tb::db::SkipListDB::DataBlock::set_data(
	void* ptr,
	size_t bytes
)
{
}


char*
tb::db::SkipListDB::DataBlock::raw()
{
}


size_t
tb::db::SkipListDB::DataBlock::raw_size()
{
}

