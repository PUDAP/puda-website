/**
 * TinaCMS home page editor stub.
 * The rendered page lives at src/pages/index.astro.
 * Expand this component with useTina / tinaField if visual editing is needed.
 */
import { useTina } from "tinacms/dist/react";
import type { PageQuery, PageQueryVariables } from "../__generated__/types";

type Props = {
  variables: PageQueryVariables;
  data: PageQuery;
  query: string;
};

const HomePage = (props: Props) => {
  useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return null;
};

export default HomePage;
