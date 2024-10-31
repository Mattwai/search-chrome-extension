import React from "react";
import "./SearchResultsList.css"
import SearchResult from "../SearchResult/SearchResult";

type Props = {
    results: {}[]
}

export const SearchResultsList = ({results}: Props) => {
    return <div className="results-list">
        {
            results.map((result, id) => {
                return <SearchResult result={result} key={id}/>
            })}
    </div>
}

