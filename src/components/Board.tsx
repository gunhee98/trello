import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
const Wrapper = styled.div`
  width: 300px;

  padding-top: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.boardColor};
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;
interface IAreaProps {
  isdraggingFromThis: boolean;
  isDraggingOver: boolean;
}
const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isdraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  padding: 20px;
`;
const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;
interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}
interface IForm {
  toDo: string;
}
export default function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    setValue("toDo", "");
  };
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(provided, info) => (
          <Area
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={info.isDraggingOver}
            isdraggingFromThis={Boolean(info.draggingFromThisWith)}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                toDoId={toDo.id}
                toDoText={toDo.text}
                index={index}
              />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}
