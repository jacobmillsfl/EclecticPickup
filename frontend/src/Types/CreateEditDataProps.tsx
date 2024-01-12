import Data from "./Data";

type CreateEditDataProps = {
    id?: number,
    close: () => void,
    add: (newItem: Data) => void,
    edit: (updatedItem: Data) => void,
    // update: (updatedCollection: Array<Data>) => void,
};

export default CreateEditDataProps