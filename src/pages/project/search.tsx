import React from "react";
import { InstantSearch } from "react-instantsearch";

import { ProjectHits } from "../../components/search/project-hits";
import { SearchBox } from "../../components/search/search-box";
import { TypesenseCollections } from "../../libs/constants";

import { searchClient } from "../../libs/typesense-adapter";

const SearchProjectsPage: React.FC = () => {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={TypesenseCollections.slide_fixtures}
    >
      <SearchBox />

      <div style={{ marginTop: 40 }}>
        <ProjectHits />
      </div>
    </InstantSearch>
  );
};

export default SearchProjectsPage;
