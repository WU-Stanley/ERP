import { inject, InjectionToken } from '@angular/core';
import { DepartmentDto, DepartmentService } from '@erp/auth';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

type DepartmentState = {
  departments: DepartmentDto[];
  selectedDepartment: DepartmentDto | null;
  isLoading: boolean;
  isEditing: boolean;
  error: string | null;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: DepartmentState = {
  departments: [],
  selectedDepartment: null,
  isEditing: false,
  isLoading: false,
  error: null,
  filter: { query: '', order: 'asc' },
};

const USER_TYPE_STATE = new InjectionToken<DepartmentState>('DepartmentState', {
  factory: () => initialState,
});

export const DepartmentStore = signalStore(
  { providedIn: 'root' },

  withState(() => inject(USER_TYPE_STATE)),
  withMethods((store, departmentService = inject(DepartmentService)) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },

    async getAllDepartments() {
      patchState(store, { isLoading: true, error: null });
      try {
        const response = await firstValueFrom(
          departmentService.getDepartments()
        );
        if (response.status) {
          patchState(store, {
            departments: response.data,
            isLoading: false,
          });
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to load roles.',
          });
        }
      } catch (error: any) {
        patchState(store, {
          isLoading: false,
          error: error.message || 'An unexpected error occurred.',
        });
        console.error('Error loading roles:', error);
      }
    },
    async addDepartment(value: DepartmentDto) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          departmentService.createDepartment(value)
        );
        if (response.status) {
          const newDepartment = response.data as DepartmentDto;
          patchState(store, {
            departments: [...store.departments(), newDepartment],
            isLoading: false,
          });
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to add role.',
          });
          console.error('Error adding role:', response.error);
        }
      } catch (error: any) {
        patchState(store, {
          isLoading: false,
          error: error.message || 'Failed to add role.',
        });
        console.error('Error adding role:', error);
      }
    },
    async selectDepartmentById(id: string): Promise<void> {
      const found = store.departments().find((a) => a.id == id) || null;
      console.log('found ', found);
      if (found) {
        patchState(store, {
          selectedDepartment: found,
        });
      } else {
        patchState(store, {
          error: `User type with ID ${id} not found!`,
        });
      }
    },
    async updateDepartment(data: DepartmentDto): Promise<void> {
      console.log('[STORE] Updating user type: ', data);
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          departmentService.updateDepartment(data)
        ); // Ensure this service exists and returns an ApiResponse
        console.log('update response: ', response);
        if (response.status) {
          const updated = response.data as DepartmentDto;
          const updatedList = store
            .departments()
            .map((lt) => (lt.id === updated.id ? updated : lt));

          patchState(store, {
            departments: updatedList,
            isLoading: false,
            error: null,
            selectedDepartment: updated, // Optional: reflect updated entity if selected
          });

          console.log('[STORE] User type updated successfully');
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to update user type.',
          });
          console.warn('[STORE] Update failed:', response.message);
        }
      } catch (error: any) {
        console.error('[STORE] Update error:', error);
        patchState(store, {
          isLoading: false,
          error: error.message || 'An unexpected error occurred.',
        });
      }
    },
    async deleteRole(id: string): Promise<void> {
      console.log('[STORE] Deleting role with ID:', id);
      patchState(store, { isLoading: true, error: null });
      try {
        const response = await firstValueFrom(
          departmentService.deleteDepartment(id)
        );
        if (response.status) {
          const updatedDepartments = store
            .departments()
            .filter((department) => department.id !== id);
          patchState(store, {
            departments: updatedDepartments,
            isLoading: false,
            error: null,
            selectedDepartment: null, // Clear selected department if it was deleted
          });
          console.log('[STORE] Department deleted successfully');
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to delete department.',
          });
          console.warn('[STORE] Delete failed:', response.message);
        }
      } catch (error: any) {
        console.error('[STORE] Delete error:', error);
        patchState(store, {
          isLoading: false,
          error: error.message || 'An unexpected error occurred.',
        });
      }
    },

    async toggleEditing() {
      patchState(store, {
        isEditing: !store.isEditing(),
      });
    },

    setFilter(query: string, order: 'asc' | 'desc') {
      patchState(store, {
        filter: { query, order },
      });
    },
  }))
);
