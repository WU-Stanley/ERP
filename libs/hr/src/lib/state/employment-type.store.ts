import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject, InjectionToken } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EmploymentTypeDto } from '@erp/auth';
import { EmploymentTypeService } from '../services/employment-type.service';

type EmploymentTypeState = {
  employmentTypes: EmploymentTypeDto[];
  selectedEmploymentType: EmploymentTypeDto | null;
  isLoading: boolean;
  isEditing: boolean;
  error: string | null;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: EmploymentTypeState = {
  employmentTypes: [],
  selectedEmploymentType: null,
  isLoading: false,
  isEditing: false,
  error: null,
  filter: { query: '', order: 'asc' },
};

const Employment_TYPE_STATE = new InjectionToken<EmploymentTypeState>(
  'EmploymentTypeState',
  {
    factory: () => initialState,
  }
);

export const EmploymentTypeStore = signalStore(
  { providedIn: 'root' },

  withState(() => inject(Employment_TYPE_STATE)),

  withMethods(
    (store, employmentTypeService = inject(EmploymentTypeService)) => ({
      updateQuery(query: string): void {
        patchState(store, (state) => ({ filter: { ...state.filter, query } }));
      },
      updateOrder(order: 'asc' | 'desc'): void {
        patchState(store, (state) => ({ filter: { ...state.filter, order } }));
      },
      async getAllEmploymentTypes(): Promise<void> {
        patchState(store, { isLoading: true, error: null });
        console.log('Fetching all Employment types...');
        try {
          const response = await firstValueFrom(
            employmentTypeService.getEmploymentTypes()
          );
          if (response.status) {
            patchState(store, {
              employmentTypes: response.data,
              isLoading: false,
            });
          } else {
            patchState(store, {
              isLoading: false,
              error: response.message || 'Failed to load Employment types.',
            });
          }
        } catch (error: any) {
          patchState(store, {
            isLoading: false,
            error: error.message || 'An unexpected error occurred.',
          });
          console.error('Error loading Employment types:', error);
        }
      },

      async addEmploymentType(dto: EmploymentTypeDto): Promise<void> {
        console.log('adding Employment type to state: ', dto);
        patchState(store, { isLoading: true, error: null });

        try {
          const response = await firstValueFrom(
            employmentTypeService.createEmploymentType(dto)
          );

          if (response.status) {
            const newEmploymentType = response.data as EmploymentTypeDto;
            const current = store.employmentTypes(); // Ensure fresh value
            console.log('new Employment type: ', newEmploymentType);
            console.log('existing list: ', current);

            // Use signal getter directly
            const updated = [...current, newEmploymentType];
            console.log('Updated list: ', updated);
            patchState(store, {
              employmentTypes: updated,
              isLoading: false,
            });

            console.log('updated list: ', store.employmentTypes());
          } else {
            console.log('adding Employment type failed: ');
            patchState(store, {
              isLoading: false,
              error: response.message || 'Failed to add Employment type.',
            });
          }
        } catch (error: any) {
          patchState(store, {
            isLoading: false,
            error: error.message || 'An unexpected error occurred.',
          });
          console.error('Error adding Employment type:', error);
        }
      },

      async selectEmploymentTypeById(id: string): Promise<void> {
        const found = store.employmentTypes().find((a) => a.id == id) || null;
        console.log('found ', found);
        if (found) {
          patchState(store, {
            selectedEmploymentType: found,
          });
        } else {
          patchState(store, {
            error: `Employment type with ID ${id} not found!`,
          });
        }
      },

      async updateEmploymentType(data: EmploymentTypeDto): Promise<void> {
        console.log('[STORE] Updating Employment type: ', data);
        patchState(store, { isLoading: true, error: null });

        try {
          const response = await firstValueFrom(
            employmentTypeService.updateEmploymentType(data)
          ); // Ensure this service exists and returns an ApiResponse
          console.log('update response: ', response);
          if (response.status) {
            const updated = response.data as EmploymentTypeDto;
            const updatedList = store
              .employmentTypes()
              .map((lt) => (lt.id === updated.id ? updated : lt));

            patchState(store, {
              employmentTypes: updatedList,
              isLoading: false,
              error: null,
              selectedEmploymentType: updated, // Optional: reflect updated entity if selected
            });

            console.log('[STORE] Employment type updated successfully');
          } else {
            patchState(store, {
              isLoading: false,
              error: response.message || 'Failed to update Employment type.',
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
    })
  )
);
