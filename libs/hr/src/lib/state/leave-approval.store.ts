import { inject, InjectionToken } from '@angular/core';
import { LeaveRequestApproval } from '../dtos';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LeaveApprovalService } from '../services/leave-approval.service';
import { firstValueFrom } from 'rxjs';

type LeaveRequestApprovalState = {
  leaveApproval: LeaveRequestApproval[];
  myLeaveRequestApprovals: LeaveRequestApproval[];
  selectedLeaveRequestApproval: LeaveRequestApproval | null;
  isLoading: boolean;
  isEditing: boolean;
  error: string | null;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: LeaveRequestApprovalState = {
  leaveApproval: [],
  myLeaveRequestApprovals: [],
  selectedLeaveRequestApproval: null,
  isLoading: false,
  isEditing: false,
  error: null,
  filter: { query: '', order: 'asc' },
};

const LEAVE_REQUEST_APPROVAL_STATE =
  new InjectionToken<LeaveRequestApprovalState>(
    'LEAVE_REQUEST_APPROVAL_STATE',
    {
      //   providedIn: 'root',
      factory: () => initialState,
    }
  );

export const LeaveRequestApprovalStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(LEAVE_REQUEST_APPROVAL_STATE)),

  withMethods((store, leaveApprovalService = inject(LeaveApprovalService)) => ({
    selectLeaveApproval: (id: string) =>
      inject(LEAVE_REQUEST_APPROVAL_STATE).leaveApproval.find(
        (l) => l.id === id
      ),
    async selectMyLeaveRequestApprovals(approverPersonId: string) {
      patchState(store, { isLoading: true, error: null });
      const response = await firstValueFrom(
        leaveApprovalService.getLeaveApprovalByApprovalPersonId(
          approverPersonId
        )
      );

      if (response.status) {
        patchState(store, { myLeaveRequestApprovals: response.data });
      } else {
        patchState(store, { error: response.error });
      }
    },
    selectIsLoading: () => inject(LEAVE_REQUEST_APPROVAL_STATE).isLoading,
    selectIsEditing: () => inject(LEAVE_REQUEST_APPROVAL_STATE).isEditing,
    selectError: () => inject(LEAVE_REQUEST_APPROVAL_STATE).error,
    selectFilter: () => inject(LEAVE_REQUEST_APPROVAL_STATE).filter,
  }))
);
