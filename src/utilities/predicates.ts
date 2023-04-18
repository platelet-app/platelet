// I'm too dumb to figure proper type
const unarchived = (m: any) => m.archived("ne", 1);

const LocalPredicates = {
    unarchived,
};

export default LocalPredicates;
