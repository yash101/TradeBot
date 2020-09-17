#ifndef _FRED_FRED_H
#define _FRED_FRED_H

#include <string>
#include <vector>

namespace tb
{
	namespace Fred
	{
		class FredSeries;
		class FredCategory;
		class FredAPI;

		class FredSeries
		{
			
		private:

			std::string id;
			std::string title;

			std::string realtime_start;
			std::string realtime_end;

			std::string observation_start;
			std::string observation_end;

			std::string frequency;
			std::string units;
			std::string seasonal_adjustment;
	
			std::string last_updated;

			int popularity;
			int group_popularity;

			std::string notes;

		public:

			static std::vector<FredSeries>
			get_category_series(
				FredAPI& api,
				int category
			);

		};

		class FredCategory
		{

		public:

			int category_id;
			int parent_category_id;
			std::string category_name;

		private:

			void set_category_id(int id);
			int get_category_id();

			void set_parent_category_id(int id);
			int get_parent_category_id();

			void set_category_name(std::string name);
			std::string get_category_name();


			static FredCategory
			get_category(
				FredAPI& api,
				int id
			);

			static std::vector<FredCategory>
			get_category_children(
				FredAPI& api,
				int parent_id
			);

			static std::vector<FredCategory>
			get_category_related(
				FredAPI& api,
				int category
			);



		};


		class FredAPI
		{
		public:

			void
				set_api_key(std::string key);

			Fred();
			virtual ~Fred();

		};
	}
}

#endif
