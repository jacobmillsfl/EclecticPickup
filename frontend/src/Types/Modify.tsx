type Modify<T, K extends keyof T, NewPropType> = Omit<T, K> & { [P in K]: NewPropType };

export default Modify;