import { ApiResponse, ApiResponseWithData } from "../Utilities/Api/ApiTypes";
import CreateEditDataProps from "./CreateEditDataProps";
import Data from "./Data";

type DataTable = {
    name: string,
    items: Array<Data>,
    component: React.FC<CreateEditDataProps>,
    deleteMethod: (id: number) => Promise<ApiResponse>,
    add: (newItem: Data) => void,
    edit: (updatedItem: Data) => void,
    setItems: (newItems: Array<Data>) => void,
}

export default DataTable;