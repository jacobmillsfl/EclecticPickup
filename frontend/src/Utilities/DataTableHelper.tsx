import { AlertVariant, CreateEditDataProps, Data, DataTable, DataTableOptions } from "../Types";
import { ApiResponse, ICrudApi } from "./Api/ApiTypes";

interface IAlertUpdate {
    (display: boolean, heading: string, variant: AlertVariant, message: string) : void
}

export default class DataTableHelper {
    static createDataTable = <T extends Data>({
        name,
        items,
        setItems,
        component,
        api,
    }: DataTableOptions<T>): DataTable<T> => {
        const add = async (newItem: T) => {
            const newItems = [...items, newItem];
            setItems(newItems);

        };

        const edit = async (updatedItem: T) => {
            const updatedItems = items.map((item: T) => (item.id === updatedItem.id ? updatedItem : item));
            setItems(updatedItems);
        };

        const deleteMethod = async (id: number) => {
            return api.delete(id);
        };

        return {
            name,
            items,
            component,
            deleteMethod,
            add,
            edit,
            setItems,
        };
    };

    static handleDataSubmit = async <T extends Data>(
        props: CreateEditDataProps<T>,
        newData: Omit<T, 'id'>,
        api: ICrudApi<T>,
        updateAlert: IAlertUpdate,
      ) => {
        const { id, close, add, edit } = props;
      
        const validateFields = Object.values(newData).every((field) => field !== '');
      
        if (validateFields) {
          try {
            const result = id ? await api.update({ id, ...newData } as T) : await api.create(newData as T);
      
            if (result.status === 200 && result.data) {
              id ? edit(result.data) : add(result.data);
              close();
            } else {
              updateAlert(true, 'Error', 'danger', result.msg || 'An error occurred');
            }
          } catch (error) {
            console.error('Error:', error);
            updateAlert(true, 'Error', 'danger', 'An unexpected error occurred');
          }
        } else {
          updateAlert(true, 'Error', 'warning', 'All fields are required');
        }
      };
}