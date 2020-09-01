#include "https_abstraction.h"

tb::CurlRequest::CurlRequest() :
    curl(nullptr)
{
    curl = curl_easy_init();
}

tb::CurlRequest::~CurlRequest()
{
    curl_easy_cleanup(curl);
    curl = nullptr;
}

tb::GetRequest::GetRequest()
{
}

tb::GetRequest::~GetRequest()
{
}

void
tb::GetRequest::setUrl(std::string url)
{
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
}

void
tb::GetRequest::doRequest()
{
    res = curl_easy_perform(curl);
}

