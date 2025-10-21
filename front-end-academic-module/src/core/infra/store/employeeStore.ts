import type { Employee } from '@/core/domain/entities/employee';
import { defineStore } from "pinia";
import { ref } from "vue";

export const useEmployeeStore = defineStore("employee", () => {
    const employee = ref<Employee | null>(null);

    function setEmployee(data: Employee) {
        employee.value = data;
    }

    return {
        employee,
        setEmployee,
    };
});