export type Role = 'foreman' | 'owner' | 'supervisor'

export type NodeStatus = 'pending' | 'submitted' | 'rejected' | 'passed'

export type RectificationStatus = 'pending' | 'resolved' | 'verified'

export interface Photo {
  id: string
  url: string
  caption?: string
  uploadAt: string
  uploadBy: Role
}

export interface Signature {
  role: Role
  name: string
  signed: boolean
  signedAt?: string
  signatureData?: string
}

export interface Rectification {
  id: string
  description: string
  status: RectificationStatus
  createdAt: string
  createdBy: Role
  beforePhotos: Photo[]
  afterPhotos: Photo[]
  resolvedAt?: string
  verifiedAt?: string
}

export interface AcceptanceNode {
  id: string
  name: string
  description: string
  icon: string
  status: NodeStatus
  photos: Photo[]
  signatures: Signature[]
  rectifications: Rectification[]
  submittedAt?: string
  passedAt?: string
}

export interface Project {
  id: string
  name: string
  address: string
  nodes: AcceptanceNode[]
}

export interface RoleInfo {
  role: Role
  name: string
  avatar: string
}
