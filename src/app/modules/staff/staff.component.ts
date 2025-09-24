import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Staff, DataService } from '../../services/data.service';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss',
})
export class StaffComponent {
  // Dữ liệu nhân viên
  protected readonly staff = signal<Staff[]>([]);

  constructor(private dataService: DataService) {
    // Khởi tạo dữ liệu nhân viên từ service
    this.staff.set(this.dataService.getStaff()());
  }

  // Trạng thái UI
  protected readonly showAddModal = signal(false);
  protected readonly showEditModal = signal(false);
  protected readonly showDetailModal = signal(false);
  protected readonly selectedStaff = signal<Staff | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly selectedDepartment = signal('all');
  protected readonly selectedStatus = signal('all');

  // Form data
  protected readonly newStaff = signal<Partial<Staff>>({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: 0,
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    notes: '',
    status: 'active',
  });

  // Computed values
  protected readonly departments = computed(() => {
    const depts = [...new Set(this.staff().map((s) => s.department))];
    return [
      { id: 'all', name: 'Tất cả phòng ban' },
      ...depts.map((dept) => ({ id: dept, name: dept })),
    ];
  });

  protected readonly filteredStaff = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const department = this.selectedDepartment();
    const status = this.selectedStatus();

    return this.staff().filter((member) => {
      const matchesSearch =
        !term ||
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.phone.includes(term) ||
        member.position.toLowerCase().includes(term);
      const matchesDepartment = department === 'all' || member.department === department;
      const matchesStatus = status === 'all' || member.status === status;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  });

  protected readonly totalStaff = computed(() => this.staff().length);
  protected readonly activeStaff = computed(
    () => this.staff().filter((s) => s.status === 'active').length
  );
  protected readonly totalSalary = computed(() =>
    this.staff()
      .filter((s) => s.status === 'active')
      .reduce((acc, s) => acc + s.salary, 0)
  );
  protected readonly averageSalary = computed(() => {
    const active = this.activeStaff();
    return active > 0 ? this.totalSalary() / active : 0;
  });

  // Methods
  protected onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  protected onDepartmentChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedDepartment.set(target.value);
  }

  protected onStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus.set(target.value);
  }

  protected onStaffFieldChange(field: string, event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const staff = this.selectedStaff();
    if (staff) {
      (staff as any)[field] = target.value;
      this.selectedStaff.set({ ...staff });
    }
  }

  protected onStaffNumberFieldChange(field: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const staff = this.selectedStaff();
    if (staff) {
      (staff as any)[field] = +target.value;
      this.selectedStaff.set({ ...staff });
    }
  }

  protected openAddModal() {
    this.newStaff.set({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: 0,
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      notes: '',
      status: 'active',
    });
    this.showAddModal.set(true);
  }

  protected openEditModal(member: Staff) {
    this.selectedStaff.set({ ...member });
    this.showEditModal.set(true);
  }

  protected openDetailModal(member: Staff) {
    this.selectedStaff.set(member);
    this.showDetailModal.set(true);
  }

  protected closeModals() {
    this.showAddModal.set(false);
    this.showEditModal.set(false);
    this.showDetailModal.set(false);
    this.selectedStaff.set(null);
  }

  protected addStaff() {
    const member = this.newStaff();
    if (!member.name || !member.email || !member.phone) return;

    const newMember: Staff = {
      id: Date.now().toString(),
      name: member.name!,
      email: member.email!,
      phone: member.phone!,
      position: member.position || '',
      department: member.department || '',
      salary: member.salary || 0,
      hireDate: new Date(),
      status: (member.status || 'active') as 'active' | 'inactive',
      address: member.address || '',
      emergencyContact: member.emergencyContact || '',
      emergencyPhone: member.emergencyPhone || '',
      notes: member.notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.staff.update((members) => [...members, newMember]);
    this.closeModals();
  }

  protected updateStaff() {
    const member = this.selectedStaff();
    if (!member) return;

    const updatedMember: Staff = {
      ...member,
      status: member.status as 'active' | 'inactive',
      updatedAt: new Date(),
    };
    this.staff.update((members) => members.map((m) => (m.id === member.id ? updatedMember : m)));
    this.closeModals();
  }

  protected deleteStaff(staffId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      this.staff.update((members) => members.filter((m) => m.id !== staffId));
    }
  }

  protected toggleStaffStatus(member: Staff) {
    const updatedMember: Staff = {
      ...member,
      status: (member.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive',
      updatedAt: new Date(),
    };
    this.staff.update((members) => members.map((m) => (m.id === member.id ? updatedMember : m)));
  }

  protected formatVnd(value: number): string {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  protected formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN');
  }

  protected getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  protected getWorkDuration(hireDate: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - hireDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
      return `${years} năm ${months} tháng`;
    } else {
      return `${months} tháng`;
    }
  }

  protected getCurrentDate(): Date {
    return new Date();
  }

  protected formatDateOrCurrent(date?: Date): string {
    return this.formatDate(date || this.getCurrentDate());
  }

  protected getWorkDurationOrCurrent(date?: Date): string {
    return this.getWorkDuration(date || this.getCurrentDate());
  }
}
