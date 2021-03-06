import { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  addAttribute,
  setNameRelationship,
  setTypeRelationship,
  select,
  deselect,
  deleteChildren,
  deleteRelationship,
  addConnection,
  repositionComponents,
} from "../../actions/actions";
import Connection from "./Connection";
import { getRandomInt } from "../../global/utils";
import { nameSize, spawnRadius } from "../../global/constants";

class RelationshipProperties extends Component {
  componentDidMount() {
    this.nameInput.focus();
  }

  handleFocus = (e) => e.target.select();

  findRelationshipIndex = (relationship) => relationship.id === this.props.selector.current.id;

  nameValueChange = (e) =>
    this.props.setNameRelationship({
      id: this.props.selector.current.id,
      name: e.target.value,
    });

  typeValueChange = (e) => {
    this.props.setTypeRelationship({
      id: this.props.selector.current.id,
      type: e.target.value,
      checked: e.target.checked,
    });
  };

  handleAddAttribute = (relationshipIndex) => {
    // Randomly position the attribute around the relationship
    const radius = spawnRadius;
    var randomAngle = getRandomInt(0, 360);
    var xOffset = radius * Math.cos(randomAngle);
    var yOffset = radius * Math.sin(randomAngle);
    this.props.addAttribute({
      id: this.props.selector.current.id,
      x: this.props.components.relationships[relationshipIndex].x + xOffset,
      y: this.props.components.relationships[relationshipIndex].y + yOffset,
    });
    this.props.repositionComponents();
    this.props.select({
      type: "attribute",
      id: this.props.components.count + 1,
      parentId: this.props.selector.current.id,
    });
  };

  render() {
    var relationshipIndex = this.props.components.relationships.findIndex(this.findRelationshipIndex);
    var addConnectionButton =
      this.props.components.relationships[relationshipIndex].connections.length < 5 ? (
        <button
          className="properties-neutral-button"
          type="button"
          onClick={() => {
            this.props.addConnection({ id: this.props.selector.current.id });
          }}
        >
          Add Connection
        </button>
      ) : null;

    return (
      <div className="sidepanel-content">
        <h3>Relationship</h3>
        <label>
          Name:{" "}
          <input
            className="big-editor-input"
            type="text"
            name="name"
            id="name"
            ref={(input) => {
              this.nameInput = input;
            }}
            onFocus={this.handleFocus}
            maxLength={nameSize}
            value={this.props.components.relationships[relationshipIndex].name}
            onChange={this.nameValueChange}
          />
        </label>
        <hr />
        <table className="type-inputs">
          <tbody>
            <tr>
              <td>Type:</td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    name="type"
                    value="weak"
                    checked={this.props.components.relationships[relationshipIndex].type.weak}
                    onChange={this.typeValueChange}
                  />
                  Identifying
                </label>
              </td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div className="connections-list">
          <Connections
            selected={this.props.selector.current}
            entities={this.props.components.entities}
            relationships={this.props.components.relationships}
            findRelationshipIndex={this.findRelationshipIndex}
          />
        </div>
        {addConnectionButton}
        <hr />
        <div className="buttons-list">
          <button
            className="properties-neutral-button"
            type="button"
            onClick={() => this.handleAddAttribute(relationshipIndex)}
          >
            New Attribute
          </button>
          <button
            className="properties-delete-button"
            type="button"
            onClick={() => {
              this.props.deleteChildren({ id: this.props.selector.current.id });
              this.props.deleteRelationship({
                id: this.props.selector.current.id,
              });
              this.props.deselect();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}

// Component for all connections
const Connections = (props) => {
  let connectionList = [];
  let relationshipIndex = props.relationships.findIndex(props.findRelationshipIndex);
  for (let i in props.relationships[relationshipIndex].connections) {
    connectionList.push(
      <Fragment key={i}>
        <Connection
          index={i}
          connection={props.relationships[relationshipIndex].connections[i]}
          relationshipIndex={relationshipIndex}
          relationshipId={props.selected.id}
        />
      </Fragment>
    );
  }
  return connectionList;
};

const mapStateToProps = (state) => ({
  components: state.components,
  selector: state.selector,
});

const mapDispatchToProps = {
  addAttribute,
  setNameRelationship,
  setTypeRelationship,
  select,
  deselect,
  deleteChildren,
  deleteRelationship,
  addConnection,
  repositionComponents,
};

export default connect(mapStateToProps, mapDispatchToProps)(RelationshipProperties);
