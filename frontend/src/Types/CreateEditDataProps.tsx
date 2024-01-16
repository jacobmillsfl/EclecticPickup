import Data from "./Data";

type CreateEditDataProps<T extends Data> = {
    id?: number,
    close: () => void,
    add: (newItem: T) => void,
    edit: (updatedItem: T) => void,
};

export default CreateEditDataProps