import { inject, InjectionToken } from '@angular/core';
import { UserTypeDto, UserTypeService } from '@erp/auth';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

type UserTypeState = {
  userTypes: UserTypeDto[];
  selectedUserType: UserTypeDto | null;
  isLoading: boolean;
  isEditing: boolean;
  error: string | null;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: UserTypeState = {
  userTypes: [],
  selectedUserType: null,
  isEditing: false,
  isLoading: false,
  error: null,
  filter: { query: '', order: 'asc' },
};

const USER_TYPE_STATE = new InjectionToken<UserTypeState>('UserTypeState', {
  factory: () => initialState,
});

export const UserTypeStore = signalStore(
  { providedIn: 'root' },

  withState(() => inject(USER_TYPE_STATE)),
  withMethods((store, userTypeService = inject(UserTypeService)) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },

    async getAllUserTypes() {
      patchState(store, { isLoading: true, error: null });
      try {
        const response = await firstValueFrom(userTypeService.getUserTypes());
        if (response.status) {
          patchState(store, {
            userTypes: response.data,
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
    async addUserType(value: UserTypeDto) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          userTypeService.addUserType(value)
        );
        if (response.status) {
          const newUserType = response.data as UserTypeDto;
          patchState(store, {
            userTypes: [...store.userTypes(), newUserType],
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
    async selectUserTypeById(id: string): Promise<void> {
      const found = store.userTypes().find((a) => a.id == id) || null;
      console.log('found ', found);
      if (found) {
        patchState(store, {
          selectedUserType: found,
        });
      } else {
        patchState(store, {
          error: `User type with ID ${id} not found!`,
        });
      }
    },
    // async updateUserType(data: UserTypeDto): Promise<void> {
    //   console.log('[STORE] Updating user type: ', data);
    //   patchState(store, { isLoading: true, error: null });

    //   try {
    //     const response = await firstValueFrom(userTypeService.updateUserType(data)); // Ensure this service exists and returns an ApiResponse
    //     console.log('update response: ', response);
    //     if (response.status) {
    //       const updated = response.data as UserTypeDto;
    //       const updatedList = store
    //         .userTypes()
    //         .map((lt) => (lt.id === updated.id ? updated : lt));

    //       patchState(store, {
    //         userTypes: updatedList,
    //         isLoading: false,
    //         error: null,
    //         selectedUserType: updated, // Optional: reflect updated entity if selected
    //       });

    //       console.log('[STORE] User type updated successfully');
    //     } else {
    //       patchState(store, {
    //         isLoading: false,
    //         error: response.message || 'Failed to update user type.',
    //       });
    //       console.warn('[STORE] Update failed:', response.message);
    //     }
    //   } catch (error: any) {
    //     console.error('[STORE] Update error:', error);
    //     patchState(store, {
    //       isLoading: false,
    //       error: error.message || 'An unexpected error occurred.',
    //     });
    //   }
    // },
    // async deleteRole(id: string): Promise<void> {
    //   console.log('[STORE] Deleting role with ID:', id);
    //   patchState(store, { isLoading: true, error: null });
    //   try {
    //     const response = await firstValueFrom(roleService.deleteRole(id));
    //     if (response.status) {
    //       const updatedRoles = store.roles().filter((role) => role.id !== id);
    //       patchState(store, {
    //         roles: updatedRoles,
    //         isLoading: false,
    //         error: null,
    //         selectedRole: null, // Clear selected role if it was deleted
    //       });
    //       console.log('[STORE] Role deleted successfully');
    //     } else {
    //       patchState(store, {
    //         isLoading: false,
    //         error: response.message || 'Failed to delete role.',
    //       });
    //       console.warn('[STORE] Delete failed:', response.message);
    //     }
    //   } catch (error: any) {
    //     console.error('[STORE] Delete error:', error);
    //     patchState(store, {
    //       isLoading: false,
    //       error: error.message || 'An unexpected error occurred.',
    //     });
    //   }
    // },

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
