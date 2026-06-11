import { inject, InjectionToken } from '@angular/core';
import { RoleDto, RoleService } from '@erp/auth';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

type RoleState = {
  roles: RoleDto[];
  selectedRole: RoleDto | null;
  isLoading: boolean;
  isEditing: boolean;
  error: string | null;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: RoleState = {
  roles: [],
  selectedRole: null,
  isEditing: false,
  isLoading: false,
  error: null,
  filter: { query: '', order: 'asc' },
};

const ROLE_STATE = new InjectionToken<RoleState>('RoleState', {
  factory: () => initialState,
});

export const RoleStore = signalStore(
  { providedIn: 'root' },

  withState(() => inject(ROLE_STATE)),
  withMethods((store, roleService = inject(RoleService)) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },

    async getAllRoles() {
      patchState(store, { isLoading: true, error: null });
      try {
        const response = await firstValueFrom(roleService.getRoles());
        if (response.status) {
          patchState(store, {
            roles: response.data,
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
    async addRole(value: RoleDto) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(roleService.addRole(value));
        if (response.status) {
          const newRole = response.data as RoleDto;
          patchState(store, {
            roles: [...store.roles(), newRole],
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
    async selectRoleById(id: string): Promise<void> {
      const found = store.roles().find((a) => a.id == id) || null;
      console.log('found ', found);
      if (found) {
        patchState(store, {
          selectedRole: found,
        });
      } else {
        patchState(store, {
          error: `Leave type with ID ${id} not found!`,
        });
      }
    },
    async updateRole(data: RoleDto): Promise<void> {
      console.log('[STORE] Updating leave type: ', data);
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(roleService.updateRole(data)); // Ensure this service exists and returns an ApiResponse
        console.log('update response: ', response);
        if (response.status) {
          const updated = response.data as RoleDto;
          const updatedList = store
            .roles()
            .map((lt) => (lt.id === updated.id ? updated : lt));

          patchState(store, {
            roles: updatedList,
            isLoading: false,
            error: null,
            selectedRole: updated, // Optional: reflect updated entity if selected
          });

          console.log('[STORE] Leave type updated successfully');
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to update leave type.',
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
        const response = await firstValueFrom(roleService.deleteRole(id));
        if (response.status) {
          const updatedRoles = store.roles().filter((role) => role.id !== id);
          patchState(store, {
            roles: updatedRoles,
            isLoading: false,
            error: null,
            selectedRole: null, // Clear selected role if it was deleted
          });
          console.log('[STORE] Role deleted successfully');
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to delete role.',
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
    async getRoleById(id: string) {
      console.log('[STORE] Fetching role by ID:', id);
      patchState(store, { isLoading: true, error: null });
      try {
        const response = await firstValueFrom(roleService.getRoleById(id));
        console.log('found ', response);
        if (response) {
          patchState(store, {
            selectedRole: response.data as RoleDto,
            isLoading: false,
            error: null,
          });
        } else {
          patchState(store, {
            error: `Role with ID ${id} not found!`,
            isLoading: false,
          });
        }
      } catch (error: any) {
        console.error('[STORE] Error fetching role:', error);
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
