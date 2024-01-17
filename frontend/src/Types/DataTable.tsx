import { ApiResponse, ApiResponseWithData } from "../Utilities/Api/ApiTypes";
import CreateEditDataProps from "./CreateEditDataProps";
import Data from "./Data";

type DataTable<T extends Data> = {
    name: string,
    items: Array<T>,
    component: React.FC<CreateEditDataProps<T>>,
    deleteMethod: (id: number) => Promise<ApiResponse>,
    add: (newItem: T) => void,
    edit: (updatedItem: T) => void,
    setItems: (newItems: Array<T>) => void,
}

export default DataTable;