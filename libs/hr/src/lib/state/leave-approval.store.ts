import { inject, InjectionToken } from '@angular/core';
import { ApprovalDelegationDto, LeaveRequestApproval } from '../dtos';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LeaveApprovalService } from '../services/leave-approval.service';
import { firstValueFrom } from 'rxjs';
import { AlertService } from '@erp/core';

type LeaveRequestApprovalState = {
  leaveApprovals: LeaveRequestApproval[];
  myLeaveRequestApprovals: LeaveRequestApproval[];
  selectedLeaveRequestApproval: LeaveRequestApproval | null;
  isLoading: boolean;
  isEditing: boolean;
  error: string | null;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: LeaveRequestApprovalState = {
  leaveApprovals: [],
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

  withMethods(
    (
      store,
      leaveApprovalService = inject(LeaveApprovalService),
      alertService = inject(AlertService)
    ) => ({
      selectLeaveApproval: (id: string) =>
        inject(LEAVE_REQUEST_APPROVAL_STATE).leaveApprovals.find(
          (l) => l.id === id
        ),
      async getMyLeaveRequestApprovals(approverPersonId: string) {
        patchState(store, { isLoading: true, error: null });
        const response = await firstValueFrom(
          leaveApprovalService.getLeaveApprovalByApprovalPersonId(
            approverPersonId
          )
        );

        if (response.status) {
          patchState(store, {
            myLeaveRequestApprovals: response.data,
            isLoading: false,
            error: null,
            leaveApprovals: [],
          });
        } else {
          console.log('error response: ', response);
          patchState(store, { error: response.error, isLoading: false });
        }
        alertService.showSuccess(response.message);
      },
      getAllLeaveRequestApprovals: async () => {
        patchState(store, { isLoading: true, error: null });
        const response = await firstValueFrom(
          leaveApprovalService.getAllLeaveRequestApprovals()
        );
        console.log('leave request approvals ', response.data);

        if (response.status) {
          patchState(store, {
            leaveApprovals: response.data,
            isLoading: false,
            error: null,
          });
        } else {
          patchState(store, { error: response.error, isLoading: false });
        }
        alertService.showSuccess(response.message);
      },
      getLeaveApprovalsByRequestId: async (requestId: string) => {
        patchState(store, { isLoading: true, error: null });
        const response = await firstValueFrom(
          leaveApprovalService.getLeaveApprovalsByRequestId(requestId)
        );

        if (response.status) {
          patchState(store, {
            leaveApprovals: response.data,
            isLoading: false,
            error: null,
            // myLeaveRequestApprovals: [],
          });
        } else {
          patchState(store, { error: response.error, isLoading: false });
        }
        alertService.showSuccess(response.message);
      },
      setSelectedLeaveRequestApproval: (
        leaveRequestApproval: LeaveRequestApproval | null
      ) =>
        patchState(store, {
          selectedLeaveRequestApproval: leaveRequestApproval,
        }),

      getDelegationApprovals: async (delegationId: string) => {
        patchState(store, { isLoading: true, error: null });

        const response = await firstValueFrom(
          leaveApprovalService.getLeaveApprovalByDelegationId(delegationId)
        );

        if (response.status) {
          patchState(store, {
            myLeaveRequestApprovals: response.data,
            isLoading: false,
            error: null,
          });
        } else {
          patchState(store, { error: response.error, isLoading: false });
        }
        alertService.showSuccess(response.message);
      },

      async getByApprovalFlowAndPersonId(
        approvalFlowId: string,
        approvalPersonId: string
      ) {
        patchState(store, { isLoading: true, error: null });

        const response = await firstValueFrom(
          leaveApprovalService.getLeaveApprovalByApprovalFlowIdAndApprovalPersonId(
            approvalFlowId,
            approvalPersonId
          )
        );

        if (response.status) {
          patchState(store, {
            myLeaveRequestApprovals: response.data,
            isLoading: false,
            error: null,
          });
        } else {
          patchState(store, { error: response.error, isLoading: false });
        }
        alertService.showSuccess(response.message);
      },
      getByStepOrderAndApprovalFlowIdAsync: async (
        stepOrder: number,
        approvalFlowId: string
      ) => {
        patchState(store, { isLoading: true, error: null });

        const response = await firstValueFrom(
          leaveApprovalService.getByStepOrderAndApprovalFlowIdAsync(
            stepOrder,
            approvalFlowId
          )
        );

        if (response.status) {
          patchState(store, {
            leaveApprovals: response.data ? [response.data] : [],
            isLoading: false,
            error: null,
          });
        } else {
          patchState(store, { error: response.error, isLoading: false });
        }
        alertService.showSuccess(response.message);
      },
      getAllPendingLeaveRequestApprovals: async () => {
        patchState(store, { isLoading: true, error: null });

        const response = await firstValueFrom(
          leaveApprovalService.getAllPendingLeaveRequestApprovals()
        );

        if (response.status) {
          patchState(store, {
            leaveApprovals: response.data,
            isLoading: false,
            error: null,
          });
        } else {
          patchState(store, { error: response.error, isLoading: false });
        }
        alertService.showSuccess(response.message);
      },
      approveRejectLeaveRequest: async (
        leaveRequestId: string,
        body: {
          approvalId: string;
          comment: string;
          isApproved: boolean;
        }
      ) => {
        patchState(store, { isLoading: true, error: null });

        const response = await firstValueFrom(
          leaveApprovalService.approveRejectLeaveRequest(leaveRequestId, body)
        );
        console.log('approve reject response: ', response);
        if (response.status && response.data) {
          const updated = response.data as LeaveRequestApproval;
          patchState(store, {
            leaveApprovals: store
              .leaveApprovals()
              .map((a) => (a.id === body.approvalId ? updated ?? a : a)),
            isLoading: false,
            error: null,
          });
        } else if (!response.status) {
          patchState(store, { error: response.error, isLoading: false });
        } else {
          // response.status is true but no data returned
          patchState(store, { isLoading: false, error: null });
        }
      },
      delegateApprover: async (form: ApprovalDelegationDto) => {
        patchState(store, { isLoading: true, error: null });
        const response = await firstValueFrom(
          leaveApprovalService.delegateApprover(form)
        );
        if (response.status) {
          patchState(store, { isLoading: false, error: null });
        } else {
          patchState(store, { isLoading: false, error: response.error });
        }
        alertService.showSuccess(response.message);
      },
      selectError: () => inject(LEAVE_REQUEST_APPROVAL_STATE).error,
      selectFilter: () => inject(LEAVE_REQUEST_APPROVAL_STATE).filter,
    })
  )
);
