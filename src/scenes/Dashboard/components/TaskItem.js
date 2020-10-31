import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import TaskCard from "./TaskCardsColoured"
import {encodeUUID} from "../../../utilities";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import {AnimatePresence, motion} from "framer-motion"


const TaskItem = React.memo(function TaskItem(props) {
    return (
        <AnimatePresence>

        <motion.div
            animate={{scale: [0.6, 1]}}
            transition={{duration: 0.5}}
            exit={{scale: [1, 0]}}
        >
            <div style={{cursor: 'context-menu', position: "relative"}}>
            <Link style={{textDecoration: 'none'}}
                  key={props.taskUUID}
                  to={{
                      pathname: `/task/${encodeUUID(props.taskUUID)}`
                  }}>
                    <TaskCard
                        title={"Task"}
                        {...props}
                    />
            </Link>
            <div style={{cursor: 'context-menu', position: "absolute", bottom: 0, right: 0, zIndex: 1000}}>
                <TaskContextMenu
                    deleteDisabled={props.deleteDisabled}
                    {...props}
                />
            </div>
        </div>
        </motion.div>
        </AnimatePresence>
    )


})

export default TaskItem;
