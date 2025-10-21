import type { PaginatedStudents, Student } from '@/core/domain/entities/student';
import { defineStore } from "pinia";
import { ref } from "vue";

export const useStudentStore = defineStore("student", () => {
  const students = ref<Student[]>([]);
  const listStudent = ref<PaginatedStudents | null>(null);

  function updateStudentInStore(studentId: string, updatedStudent: Student) {
    const index = listStudent.value?.students.findIndex((s) => s.id === studentId);
    if (index !== undefined && index !== -1 && listStudent.value) {
      listStudent.value.students[index] = {
        ...listStudent.value.students[index],
        ...updatedStudent,
      };
    }
  }

  function setStudents(data: Student[]) {
    students.value = data;
  }

  function setListStudent(data: PaginatedStudents) {
    listStudent.value = data;
    students.value = data.students;
  }

  return {
    students,
    listStudent,
    setStudents,
    setListStudent,
    updateStudentInStore,
  };
});
