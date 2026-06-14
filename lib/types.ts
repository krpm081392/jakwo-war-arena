export type WarAd = {
  id: string
  title: string
  link: string
  image_url: string
  wallet: string
  price: number
  width: number
  height: number
  x: number
  y: number
  tx_signature?: string | null
  created_at?: string
}
export type ChatMessage = { id:string; wallet:string; message:string; created_at:string }
export type SiteSettings = { id:number; ticker_items:string[]; background_url?:string|null; decorations:any[] }
