import type { Dispatch, SetStateAction } from "react";
import { ICrudApi } from "../Utilities/Api/ApiTypes";
import CreateEditDataProps from "./CreateEditDataProps";
import Data from "./Data";

type DataTableOptions<T extends Data> = {
    name: string;
    items: Array<T>;
    setItems: Dispatch<SetStateAction<Array<T>>>;
    component: React.FC<CreateEditDataProps<T>>;
    api: ICrudApi<T>;
    /** Hide the Create button (e.g. fixed catalog rows only). */
    hideCreate?: boolean;
    /** Hide the Delete column (e.g. cannot remove preset rows). */
    hideDelete?: boolean;
};

export default DataTableOptions;