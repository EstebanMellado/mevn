<template>
  <div class="container">
    <h1>Notas</h1>

    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="alertMessage.color"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      <p>{{alertMessage.text}}</p>
      <hr />
      <p>This alert will dismiss after {{ dismissCountDown }} seconds...</p>
      <b-progress
        :variant="alertMessage.color"
        :max="dismissSecs"
        :value="dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>

    <form @submit.prevent="addNewNote()" v-if="!editingNote">
      <h3>Agregar nueva nota</h3>
      <input type="text" class="form-control my-2" placeholder="Nombre" v-model="newNote.name" />
      <input
        type="text"
        class="form-control my-2"
        placeholder="Descripción"
        v-model="newNote.description"
      />
      <b-button class="btn-success my-2 btn-block" type="submit">Agregar</b-button>
    </form>

    <form @submit.prevent="updateNote(editedNote)" v-if="editingNote">
      <h3>Editar nota</h3>
      <input type="text" class="form-control my-2" placeholder="Nombre" v-model="editedNote.name" />
      <input
        type="text"
        class="form-control my-2"
        placeholder="Descripción"
        v-model="editedNote.description"
      />
      <b-button class="btn-warning my-2 btn-block" type="submit">Confirmar</b-button>
      <b-button
        class="btn-secondary my-2 btn-block"
        type="submit"
        @click="editingNote = false"
      >Cancelar</b-button>
    </form>

    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in notes" :key="index">
          <th scope="row">{{item._id}}</th>
          <td>{{item.name}}</td>
          <td>{{item.description}}</td>
          <td>
            <b-button @click="deleteNote(item._id)" class="btn-danger btn-sm mx-2">Borrar</b-button>
            <b-button @click="showUpdateNote(item._id)" class="btn-warning btn-sm">Editar</b-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notes: [],
      dismissSecs: 10,
      dismissCountDown: 0,
      alertMessage: { color: "", text: "" },
      newNote: { name: "", description: "" },
      editedNote: { name: "", description: "" },
      editingNote: false
    };
  },
  created() {
    this.getAllNotes();
  },
  methods: {
    addNewNote() {
      this.axios
        .post("/nueva-nota", this.newNote)
        .then(res => {
          this.notes.push(res.data);
          this.newNote.name = "";
          this.newNote.description = "";

          this.alertMessage.color = "success";
          this.alertMessage.text = "Nota agregada";
          this.showAlert();
        })
        .catch(err => {
          this.alertMessage.color = "danger";
          if (err.response.data.error.errors.name.message) {
            this.alertMessage.text =
              err.response.data.error.errors.name.message;
          } else {
            this.alertMessage.text = "Naaaaa";
          }
          this.showAlert();
        });
    },
    getAllNotes() {
      this.axios
        .get("/notas")
        .then(res => {
          this.notes = res.data;
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    deleteNote(noteId) {
      this.axios
        .delete(`/nota/${noteId}`)
        .then(res => {
          const index = this.notes.findIndex(item => item._id === res.data._id);
          this.notes.splice(index, 1);

          this.alertMessage.color = "success";
          this.alertMessage.text = "Nota borrada";
          this.showAlert();
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    showUpdateNote(noteId) {
      this.editingNote = true;
      this.axios
        .get(`/nota/${noteId}`)
        .then(res => {
          this.editedNote = res.data;
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    updateNote(editedNote) {
      this.axios
        .put(`/nota/${editedNote._id}`, editedNote)
        .then(res => {
          const index = this.notes.findIndex(n => n._id === res.data._id);
          this.notes[index].name = res.data.name;
          this.notes[index].description = res.data.description;

          this.alertMessage.color = "success";
          this.alertMessage.text = "Nota editada";
          this.showAlert();

          this.editingNote = false;
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    }
  }
};
</script>