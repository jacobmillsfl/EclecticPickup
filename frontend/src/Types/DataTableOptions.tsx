import { ICrudApi } from "../Utilities/Api/ApiTypes";
import CreateEditDataProps from "./CreateEditDataProps";
import Data from "./Data";

type DataTableOptions<T extends Data> = {
    name: string;
    items: Array<T>;
    setItems: (items: Array<T>) => void;
    component: React.FC<CreateEditDataProps<T>>;
    api: ICrudApi<T>;
};

export default DataTableOptions;