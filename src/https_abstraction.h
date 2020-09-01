#ifndef _HTTPS_ABSTRACTION_H
#define _HTTPS_ABSTRACTION_H

#include <curl/curl.h>

#include <tuple>
#include <string>
#include <unordered_map>

namespace tb
{
    class CurlRequest
    {
    protected:
        CURL* curl;
        CURLcode res;

    public:
        CurlRequest();
        virtual ~CurlRequest();
    };

    class GetRequest : public CurlRequest
    {
    protected:
        std::unordered_map<std::string, std::string> get_params;
    public:
        GetRequest();
        virtual ~GetRequest();

        void setUrl(std::string url);
        std::unordered_map<std::string, std::string>& getParameters();
        void doRequest();
    };

    class PostRequest : public CurlRequest
    {
    protected:
    public:
    };
}

#endif