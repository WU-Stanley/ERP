import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject, InjectionToken } from '@angular/core';
import { LeaveRequestDto } from '../dtos/leave.dto';
import { firstValueFrom } from 'rxjs';
import { LeaveRequestService } from '../services/leave-request.service';

type LeaveRequestState = {
  leaveRequests: LeaveRequestDto[];
  selectedLeaveRequest: LeaveRequestDto | null;
  isLoading: boolean;
  isEditing: boolean;
  error: string | null;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: LeaveRequestState = {
  leaveRequests: [],
  selectedLeaveRequest: null,
  isLoading: false,
  isEditing: false,
  error: null,
  filter: { query: '', order: 'asc' },
};

const LEAVE_REQUEST_STATE = new InjectionToken<LeaveRequestState>(
  'LeaveRequestState',
  {
    factory: () => initialState,
  }
);

export const LeaveRequestStore = signalStore(
  { providedIn: 'root' },

  withState(() => inject(LEAVE_REQUEST_STATE)),

  withMethods((store, leaveRequestService = inject(LeaveRequestService)) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },
    async getAllLeaveRequests(): Promise<void> {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leaveRequestService.getLeaveRequests()
        );
        console.log('Leave requests fetched: ', response);
        if (response.status) {
          patchState(store, {
            leaveRequests: response.data,
            isLoading: false,
          });
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to load leave Requests.',
          });
        }
      } catch (error: any) {
        patchState(store, {
          isLoading: false,
          error: error.message || 'An unexpected error occurred.',
        });
        console.error('Error loading leave Requests:', error);
      }
    },
    async myLeaveRequests(userId: string): Promise<void> {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leaveRequestService.myLeaveRequests(userId)
        );
        if (response.status) {
          patchState(store, {
            leaveRequests: response.data,
            isLoading: false,
          });
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to load leave Requests.',
          });
        }
      } catch (error: any) {
        patchState(store, {
          isLoading: false,
          error: error.message || 'An unexpected error occurred.',
        });
        console.error('Error loading leave Requests:', error);
      }
    },
    async requestForLeave(dto: LeaveRequestDto): Promise<void> {
      console.log('adding leave Request to state: ', dto);
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leaveRequestService.requestForLeave(dto)
        );

        if (response.status) {
          const newLeaveRequest = response.data as LeaveRequestDto;
          const current = store.leaveRequests(); // Ensure fresh value
          console.log('new leave Request: ', newLeaveRequest);
          console.log('existing list: ', current);

          // Use signal getter directly
          const updated = [...current, newLeaveRequest];
          console.log('Updated list: ', updated);
          patchState(store, {
            leaveRequests: updated,
            isLoading: false,
          });

          console.log('updated list: ', store.leaveRequests());
        } else {
          console.log('adding leave Request failed: ');
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to add leave Request.',
          });
        }
      } catch (error: any) {
        patchState(store, {
          isLoading: false,
          error: error.message || 'An unexpected error occurred.',
        });
        console.error('Error adding leave Request:', error);
      }
    },
    async selectLeaveRequestById(id: string | null): Promise<void> {
      const found = store.leaveRequests().find((a) => a.id == id) || null;
      console.log('found ', found);
      if (found) {
        patchState(store, {
          selectedLeaveRequest: found,
        });
      } else {
        patchState(store, {
          error: `Leave Request with ID ${id} not found!`,
          selectedLeaveRequest: null,
        });
      }
    },
    async createLeaveRequest(data: LeaveRequestDto) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leaveRequestService.requestForLeave(data)
        );
        if (response.status) {
          const created = response.data as LeaveRequestDto;
          patchState(store, {
            leaveRequests: [...store.leaveRequests(), created],
            isLoading: false,
          });
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to create leave Request.',
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
    async updateLeaveRequest(data: LeaveRequestDto): Promise<void> {
      console.log('[STORE] Updating leave Request: ', data);
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leaveRequestService.updateLeaveRequest(data)
        ); // Ensure this service exists and returns an ApiResponse
        console.log('update response: ', response);
        if (response.status) {
          const updated = response.data as LeaveRequestDto;
          const updatedList = store
            .leaveRequests()
            .map((lt) => (lt.id === updated.id ? updated : lt));

          patchState(store, {
            leaveRequests: updatedList,
            isLoading: false,
            error: null,
            selectedLeaveRequest: updated, // Optional: reflect updated entity if selected
          });

          console.log('[STORE] Leave Request updated successfully');
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to update leave Request.',
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
    async deleteLeaveRequest(id: string): Promise<void> {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          leaveRequestService.deleteLeaveRequest(id)
        );
        if (response.status) {
          const updated = response.data as LeaveRequestDto;
          const updatedList = store
            .leaveRequests()
            .filter((lt) => lt.id !== updated.id);

          patchState(store, {
            leaveRequests: updatedList,
            isLoading: false,
            error: null,
            selectedLeaveRequest: null,
          });

          console.log('[STORE] Leave Request deleted successfully');
        } else {
          patchState(store, {
            isLoading: false,
            error: response.message || 'Failed to delete leave Request.',
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
