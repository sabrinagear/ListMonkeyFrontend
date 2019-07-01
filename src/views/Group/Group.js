import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";

import Pic from "../../components/Pic";
import TaskTable from "./TaskTable";
import Modal from "react-modal";
import TaskForm from "./TaskForm";

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      members: [],
      name: "",
      showModal: false
    };
  }

  componentDidMount() {
    this.fetchGroup();
  }

  fetchGroup = () => {
    const groupId = window.location.href.split("/").pop();
    axios
      .get(`https://chore-monkey.herokuapp.com/api/group/${groupId}`)
      .then(res => {
        this.setState({
          tasks: res.data.tasks,
          members: res.data.members,
          name: res.data.name
        });
      });
  };

  openModal = () => {
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  addTask = task => {
    console.log(task);
    axios
      .post("https://chore-monkey.herokuapp.com/api/tasks", task)
      .then(res => {
        console.log(res);
        this.setState({ showModal: false });
        this.fetchGroup();
      })
      .catch(er => console.log(er.message));
  };

  render() {
    console.log(this.state.name);
    const { name, members } = this.state;
    const groupId = window.location.href.split("/").pop();
    return (
      <div className="Dashboard">
        <h1>{name}</h1>
        <button className="updateEmailButton" onClick={this.openModal}>
          Add Task
        </button>
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={this.closeModal}
          contentLabel="Add Task"
        >
          <TaskForm
            groupId={groupId}
            members={this.state.members}
            addTask={this.addTask}
          />
        </Modal>
        <h2>Task List</h2>
        <TaskTable members={this.state.members} tasks={this.state.tasks} />
        <h2>Collaborators</h2>

        {members.map(m => {
          return <Pic key={m.id} photo={m.profilePicture} />;
        })}
        <Link to={`/groupsettings/${groupId}`}>
          <button className="waves-effect waves-light btn-large  pink hvr-shutter-out-vertical">
            <span className="iconLinks">Edit Group</span>
          </button>
        </Link>
      </div>
    );
  }
}

export default withRouter(Group);