export function calculateDueDate(dueDay: number): Date {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  let maturityMonth = currentMonth;
  if (currentDay - dueDay > 0) {
    maturityMonth = currentMonth + 1 > 11 ? 0 : currentMonth + 1;
  }

  return new Date(currentYear, maturityMonth, dueDay);
}

export function calculateDaysUntilDueDate(maturityDate: Date): number {
  const currentDate = new Date();
  const dayDiff = maturityDate.getTime() - currentDate.getTime();
  return Math.ceil(dayDiff / (1000 * 60 * 60 * 24));
}