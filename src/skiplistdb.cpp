#include "skiplistdb.h"

#include <algorithm>
#include <memory>
#include <memory.h>
#include <stdexcept>

tb::db::SkipListDB::SkipListDB() :
	file(nullptr),
	current_location(0),
	file_length(0)
{
}

tb::db::SkipListDB::~SkipListDB()
{
	if (file != nullptr)
	{
		fclose(file);
		file = nullptr;
		current_location = 0;
		file_length = 0;
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

// for sorting
static bool compare_entries(tb::db::SkipListEntry a, tb::db::SkipListEntry b)
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
}

tb::db::SkipListDB::SkipNode::SkipNode() :
	ptr_this(0),
	ptr_down(0),
	ptr_next(0),
	key(0),
	data(nullptr),
	data_length(0),
	pbuf(nullptr)
{
}

tb::db::SkipListDB::SkipNode::~SkipNode()
{
	if (data != nullptr)
		delete reinterpret_cast<char*>(data);

	if (pbuf != nullptr)
		delete pbuf;
}

void
tb::db::SkipListDB::SkipNode::write(
	tb::db::SkipListDB* db
)
{
	if (ptr_this == 0 || db->file == nullptr)
		throw std::out_of_range("The database file has not been allocated or the SkipNode is pointing to NULL");

	// move to the location of this object
	db->seek(ptr_this);

	// if data is null, this is a pointer block
	size_t blocksize =
		sizeof(ptr_down) +
		sizeof(ptr_next) +
		sizeof(key) +
		sizeof(uint64_t);		// total size of the block

	if (data != nullptr)
		blocksize += data_length;

	char* buffer = new char[blocksize];
	size_t offset = 0;
	memcpy(buffer + offset, &ptr_down, sizeof(ptr_down));
	offset += sizeof(ptr_down);
	memcpy(buffer + offset, &ptr_next, sizeof(ptr_next));
	offset += sizeof(ptr_next);
	memcpy(buffer + offset, &key, sizeof(key));
	offset += sizeof(key);
	memcpy(buffer + offset, &blocksize, sizeof(blocksize));
	offset += sizeof(blocksize);

	if (data != nullptr)
		memcpy(buffer + offset, data, data_length);

	auto ret = fwrite(
		reinterpret_cast<void*>(buffer),
		blocksize,
		1,
		db->file
	);

	// write failed
	if (ret == 0)
	{
		delete[] buffer;
		throw std::bad_alloc();
	}

	delete[] buffer;
}

void
tb::db::SkipListDB::SkipNode::read(
	tb::db::SkipListDB* db
)
{
	if (ptr_this == 0 || db->file == nullptr)
		throw std::out_of_range("The database file has not been allocated or the SkipNode is pointing to NULL");

	// move to the correct location
	db->seek(ptr_this);

	size_t blocksize;
	size_t ret;

	ret = fread(reinterpret_cast<void*>(&ptr_down), sizeof(ptr_down), 1, db->file);
	if (ret == 0)
		throw std::bad_alloc();

	ret = fread(reinterpret_cast<void*>(&ptr_next), sizeof(ptr_down), 1, db->file);
	if (ret == 0)
		throw std::bad_alloc();

	ret = fread(reinterpret_cast<void*>(&key), sizeof(ptr_down), 1, db->file);
	if (ret == 0)
		throw std::bad_alloc();

	ret = fread(reinterpret_cast<void*>(&blocksize), sizeof(ptr_down), 1, db->file);
	if (ret == 0)
		throw std::bad_alloc();

	size_t remaining_bytes = blocksize - (
		sizeof(ptr_down) +
		sizeof(ptr_next) +
		sizeof(key) +
		sizeof(blocksize)
	);

	if (pbuf != nullptr && data_length != remaining_bytes)
	{
		delete[] pbuf;
		data_length = 0;
	}

	if (data_length != remaining_bytes)
	{
		delete[] pbuf;
		pbuf = new char[remaining_bytes];
		data_length = remaining_bytes;
	}

	ret = fread(reinterpret_cast<void*>(pbuf), remaining_bytes, 1, db->file);
	if (ret == 0)
		throw std::bad_alloc();


}

void
tb::db::SkipListDB::SkipNode::allocate(
	tb::db::SkipListDB* db
)
{
}
