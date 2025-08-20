import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject, InjectionToken } from '@angular/core';
import { LeavePolicyDto } from '../dtos/leave.dto';
import { firstValueFrom } from 'rxjs';
import { LeavePolicyService } from '../services/leave-policy.service';

type LeavePolicyState = {
  leavePolicys: LeavePolicyDto[];
  selectedLeavePolicy: LeavePolicyDto | null;
  isLoading: boolean;
  isEditing: boolean;
  error: string | null;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: LeavePolicyState = {
  leavePolicys: [],
  selectedLeavePolicy: null,
  isLoading: false,
  isEditing: false,
  error: null,
  filter: { query: '', order: 'asc' },
};

const LEAVE_Policy_STATE = new InjectionToken<LeavePolicyState>(
  'LeavePolicyState',
  {
    factory: () => initialState,
  }
);

export const LeavePolicyStore = signalStore(
  { providedIn: 'root' },

  withState(() => inject(LEAVE_Policy_STATE)),

  withMethods((store, leavePolicyService = inject(LeavePolicyService)) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },
    async getAllLeavePolicys(): Promise<void> {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leavePolicyService.getLeavePolicys()
        );
        console.log('Leave Policies fetched: ', response);
        if (response.status) {
          patchState(store, {
            leavePolicys: response.data,
            isLoading: false,
          });
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to load leave Policys.',
          });
        }
      } catch (error: any) {
        patchState(store, {
          isLoading: false,
          error: error.message || 'An unexpected error occurred.',
        });
        console.error('Error loading leave Policys:', error);
      }
    },

    async addLeavePolicy(dto: LeavePolicyDto): Promise<void> {
      console.log('adding leave Policy to state: ', dto);
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leavePolicyService.createLeavePolicy(dto)
        );

        if (response.status) {
          const newLeavePolicy = response.data as LeavePolicyDto;
          const current = store.leavePolicys(); // Ensure fresh value
          console.log('new leave Policy: ', newLeavePolicy);
          console.log('existing list: ', current);

          // Use signal getter directly
          const updated = [...current, newLeavePolicy];
          console.log('Updated list: ', updated);
          patchState(store, {
            leavePolicys: updated,
            isLoading: false,
          });

          console.log('updated list: ', store.leavePolicys());
        } else {
          console.log('adding leave Policy failed: ');
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to add leave Policy.',
          });
        }
      } catch (error: any) {
        patchState(store, {
          isLoading: false,
          error: error.message || 'An unexpected error occurred.',
        });
        console.error('Error adding leave Policy:', error);
      }
    },
    async selectLeavePolicyById(id: string | null): Promise<void> {
      const found = store.leavePolicys().find((a) => a.id == id) || null;
      console.log('found ', found);
      if (found) {
        patchState(store, {
          selectedLeavePolicy: found,
        });
      } else {
        patchState(store, {
          error: `Leave Policy with ID ${id} not found!`,
          selectedLeavePolicy: null,
        });
      }
    },
    async createLeavePolicy(data: LeavePolicyDto) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leavePolicyService.createLeavePolicy(data)
        );
        if (response.status) {
          const created = response.data as LeavePolicyDto;
          patchState(store, {
            leavePolicys: [...store.leavePolicys(), created],
            isLoading: false,
          });
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to create leave Policy.',
          });
        }
      } catch (error: any) {
        console.error('[STORE] Create error:', error);
        patchState(store, {
          isLoading: false,
          error: error.message || 'An unexpected error occurred.',
        });
      }
    },
    async updateLeavePolicy(data: LeavePolicyDto): Promise<void> {
      console.log('[STORE] Updating leave Policy: ', data);
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leavePolicyService.updateLeavePolicy(data)
        ); // Ensure this service exists and returns an ApiResponse
        console.log('update response: ', response);
        if (response.status) {
          const updated = response.data as LeavePolicyDto;
          const updatedList = store
            .leavePolicys()
            .map((lt) => (lt.id === updated.id ? updated : lt));

          patchState(store, {
            leavePolicys: updatedList,
            isLoading: false,
            error: null,
            selectedLeavePolicy: updated, // Optional: reflect updated entity if selected
          });

          console.log('[STORE] Leave Policy updated successfully');
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to update leave Policy.',
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
    async deleteLeavePolicy(id: string): Promise<void> {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leavePolicyService.deleteLeavePolicy(id)
        );
        if (response.status) {
          const updated = response.data as LeavePolicyDto;
          const updatedList = store
            .leavePolicys()
            .filter((lt) => lt.id !== updated.id);

          patchState(store, {
            leavePolicys: updatedList,
            isLoading: false,
            error: null,
            selectedLeavePolicy: null,
          });

          console.log('[STORE] Leave Policy deleted successfully');
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to delete leave Policy.',
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
