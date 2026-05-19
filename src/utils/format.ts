export const formatCurrency = (value: number | string | null | undefined) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value || 0))

export const formatDate = (value: string | Date | null | undefined) => {
  if (!value) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value))
}

export const getCampaignPercent = (
  currentAmount: number | string | null | undefined,
  targetAmount: number | string | null | undefined
) => {
  const current = Number(currentAmount || 0)
  const target = Number(targetAmount || 0)

  if (target <= 0) return 0

  return Math.min(Math.round((current / target) * 100), 100)
}
