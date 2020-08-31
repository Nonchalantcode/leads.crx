import { dom, u } from '../../modules/utils'
import { conf } from '../data/constants'


const listURLs = () => {
    let resultsSet = new Set([...dom.fall(conf.google_url_selector)].map(result => result.textContent!))
    return [...resultsSet]
                .map(searchResult => {
                    let [url] = searchResult.split(/\s/)
                    if( url.endsWith('/') ) url = url.slice(0, url.length - 1)
                    return url
                })
}

const filterURLs = (urls: string[], ...filters: [(url: string) => boolean]) => {
    return filters
            .reduce((urls, filterCallback) => {
                return urls.filter(filterCallback)
            }, urls)
}

const isNotFlaggedTLD = (url: string) => {
    return !conf.ignored_tlds.some(tld => tld.endsWith(url))
}

export const getSearchResults = () => filterURLs(listURLs(), isNotFlaggedTLD)


export const sendMessage = <T extends { [v: string]: any }>(message: T) => {
    chrome.runtime.sendMessage(message)
}

export const isEmpty = <T>(v: T[] | string): boolean => v.length === 0;


export const capitalize = (str: string): string => {
    return u.thread(
                str,
                [(v: string) => v.toLowerCase()],
                [(v: string) => {
                    return v.trim()
                            .split(/\s/)
                            .map(substr => {
                                let [firstChar] = substr;
                                return `${firstChar.toUpperCase()}${substr.slice(1, substr.length)}`;
                            })
                            .join(" ");
                }]
            )
}