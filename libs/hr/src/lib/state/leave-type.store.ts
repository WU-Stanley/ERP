import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject, InjectionToken } from '@angular/core';
import { LeaveTypeDto } from '../dtos/leave.dto';
import { LeaveTypeService } from '../services/leave-type.service';
import { firstValueFrom } from 'rxjs';

type LeaveTypeState = {
  leaveTypes: LeaveTypeDto[];
  myLeaveTypes: LeaveTypeDto[];
  selectedLeaveType: LeaveTypeDto | null;
  isLoading: boolean;
  isEditing: boolean;
  error: string | null;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: LeaveTypeState = {
  leaveTypes: [],
  myLeaveTypes: [],
  selectedLeaveType: null,
  isLoading: false,
  isEditing: false,
  error: null,
  filter: { query: '', order: 'asc' },
};

const LEAVE_TYPE_STATE = new InjectionToken<LeaveTypeState>('LeaveTypeState', {
  factory: () => initialState,
});

export const LeaveTypeStore = signalStore(
  { providedIn: 'root' },

  withState(() => inject(LEAVE_TYPE_STATE)),

  withMethods((store, leaveTypeService = inject(LeaveTypeService)) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },
    async getAllLeaveTypes(): Promise<void> {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(leaveTypeService.getLeaveTypes());
        if (response.status) {
          patchState(store, {
            leaveTypes: response.data,
            isLoading: false,
          });
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to load leave types.',
          });
        }
      } catch (error: any) {
        patchState(store, {
          isLoading: false,
          error: error.message || 'An unexpected error occurred.',
        });
        console.error('Error loading leave types:', error);
      }
    },

    async addLeaveType(dto: LeaveTypeDto): Promise<void> {
      console.log('adding leave type to state: ', dto);
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leaveTypeService.createLeaveType(dto)
        );

        if (response.status) {
          const newLeaveType = response.data as LeaveTypeDto;
          const current = store.leaveTypes(); // Ensure fresh value
          console.log('new leave type: ', newLeaveType);
          console.log('existing list: ', current);

          // Use signal getter directly
          const updated = [...current, newLeaveType];
          console.log('Updated list: ', updated);
          patchState(store, {
            leaveTypes: updated,
            isLoading: false,
          });

          console.log('updated list: ', store.leaveTypes());
        } else {
          console.log('adding leave type failed: ');
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to add leave type.',
          });
        }
      } catch (error: any) {
        patchState(store, {
          isLoading: false,
          error: error.message || 'An unexpected error occurred.',
        });
        console.error('Error adding leave type:', error);
      }
    },
    async selectLeaveTypeById(id: string | null): Promise<void> {
      const found = store.leaveTypes().find((a) => a.id == id) || null;
      console.log('found ', found);
      if (found) {
        patchState(store, {
          selectedLeaveType: found,
        });
      } else {
        patchState(store, {
          error: `Leave type with ID ${id} not found!`,
          selectedLeaveType: null,
        });
      }
    },
    async createLeaveType(data: LeaveTypeDto) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leaveTypeService.createLeaveType(data)
        );
        if (response.status) {
          const created = response.data as LeaveTypeDto;
          patchState(store, {
            leaveTypes: [...store.leaveTypes(), created],
            isLoading: false,
          });
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to create leave type.',
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
    async updateLeaveType(data: LeaveTypeDto): Promise<void> {
      console.log('[STORE] Updating leave type: ', data);
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leaveTypeService.updateLeaveType(data)
        ); // Ensure this service exists and returns an ApiResponse
        console.log('update response: ', response);
        if (response.status) {
          const updated = response.data as LeaveTypeDto;
          const updatedList = store
            .leaveTypes()
            .map((lt) => (lt.id === updated.id ? updated : lt));

          patchState(store, {
            leaveTypes: updatedList,
            isLoading: false,
            error: null,
            selectedLeaveType: updated, // Optional: reflect updated entity if selected
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
    async getMyLeaveTypes() {
      console.log('[STORE] Getting my leave types');
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leaveTypeService.getMyLeaveTypes()
        );
        if (response.status) {
          patchState(store, {
            myLeaveTypes: response.data,
            isLoading: false,
          });
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to get my leave types.',
          });
        }
      } catch (error: any) {
        console.error('[STORE] Get my leave types error:', error);
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
