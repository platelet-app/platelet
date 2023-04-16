// I'm too dumb to figure proper type
const unarchived = (m: any) => m.archived("eq", 0);

const LocalPredicates = {
    unarchived,
};

export default LocalPredicates;
