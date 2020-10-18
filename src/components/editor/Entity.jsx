import React from "react";
import { connect } from "react-redux";
import { updatePositionEntity, updatePositionChildren, repositionComponents, select } from "../../actions/actions";
import { Group, Rect, Line, Text } from "react-konva";
import {
  stageWidth,
  stageHeight,
  entityWidth,
  entityHeight,
  entityTextWidth,
  entityWeakOffset,
  fontSize,
} from "../../global/constants";
var pixelWidth = require("string-pixel-width");

class Entity extends React.Component {
  state = { initialPosition: { x: this.props.x, y: this.props.y } };

  // Does not let the entity to be dragged out of stage bounds
  stageBound = (pos) => {
    var newX;
    var newY;

    if (pos.x > stageWidth / 2) newX = pos.x > stageWidth - entityWidth / 2 ? stageWidth - entityWidth / 2 : pos.x;
    else newX = pos.x < entityWidth / 2 ? entityWidth / 2 : pos.x;

    if (pos.y > stageHeight / 2) newY = pos.y > stageHeight - entityHeight / 2 ? stageHeight - entityHeight / 2 : pos.y;
    else newY = pos.y < entityHeight / 2 ? entityHeight / 2 : pos.y;

    return {
      x: newX,
      y: newY,
    };
  };

  render() {
    const nameText = this.props.name;
    var namePixelWidth = pixelWidth(nameText, {
      font: "Arial",
      size: fontSize,
    });

    var nameYOffset;
    if (namePixelWidth < entityTextWidth) nameYOffset = fontSize / 2;
    else if (namePixelWidth < entityTextWidth * 2) nameYOffset = fontSize;
    else if (namePixelWidth < entityTextWidth * 3) nameYOffset = (fontSize * 3) / 2;
    else nameYOffset = fontSize * 2;

    var weakRect =
      this.props.type === "weak" ? (
        <Rect
          x={-entityWidth / 2 + entityWeakOffset / 2}
          y={-entityHeight / 2 + entityWeakOffset / 2}
          width={entityWidth - entityWeakOffset}
          height={entityHeight - entityWeakOffset}
          fill="#ffdd91"
          stroke={
            this.props.id === this.props.selector.current.id && this.props.selector.current.type === "entity"
              ? "red"
              : "black"
          }
          strokeWidth={2}
        />
      ) : null;

    var associativeDiamond =
      this.props.type === "associative" ? (
        <Line
          fill="#ffdd91"
          stroke={
            this.props.id === this.props.selector.current.id && this.props.selector.current.type === "entity"
              ? "red"
              : "black"
          }
          strokeWidth={2}
          lineJoin="bevel"
          closed
          points={[
            0,
            -entityHeight / 2, // TOP
            entityWidth / 2,
            0, // RIGHT
            0,
            entityHeight / 2, // BOTTOM
            -entityWidth / 2,
            0, // LEFT
          ]}
        />
      ) : null;

    return (
      <Group
        x={this.props.x}
        y={this.props.y}
        draggable
        onDragMove={(e) => {
          this.props.updatePositionEntity({
            id: this.props.id,
            x: e.target.x(),
            y: e.target.y(),
          });
          this.props.updatePositionChildren({
            id: this.props.id,
            dx: e.target.x() - this.state.initialPosition.x,
            dy: e.target.y() - this.state.initialPosition.y,
          });
          this.setState({
            initialPosition: { x: e.target.x(), y: e.target.y() },
          });
        }}
        onDragEnd={() => this.props.repositionComponents()}
        onTap={() => {
          this.props.select({
            type: "entity",
            id: this.props.id,
            parentId: null,
          });
        }}
        onClick={() => {
          this.props.select({
            type: "entity",
            id: this.props.id,
            parentId: null,
          });
        }}
        dragBoundFunc={(pos) => this.stageBound(pos)}
      >
        <Rect
          x={-entityWidth / 2}
          y={-entityHeight / 2}
          width={entityWidth}
          height={entityHeight}
          fill="#ffdd91"
          stroke={
            this.props.id === this.props.selector.current.id && this.props.selector.current.type === "entity"
              ? "red"
              : "black"
          }
          strokeWidth={2}
        />
        {weakRect}
        {associativeDiamond}
        <Text
          text={nameText}
          fontSize={fontSize}
          align="center"
          width={entityTextWidth}
          offsetX={entityTextWidth / 2}
          offsetY={nameYOffset}
        />
      </Group>
    );
  }
}

const mapStateToProps = (state) => ({
  selector: state.selector,
});

const mapDispatchToProps = {
  updatePositionEntity,
  updatePositionChildren,
  repositionComponents,
  select,
};

export default connect(mapStateToProps, mapDispatchToProps)(Entity);
