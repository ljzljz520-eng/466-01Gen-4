export type Role = 'foreman' | 'owner' | 'supervisor'

export type NodeStatus = 'pending' | 'submitted' | 'rejected' | 'passed'

export type RectificationStatus = 'pending' | 'resolved' | 'verified'

export interface User {
  id: string
  username: string
  name: string
  role: Role
  avatar: string
  createdAt: string
}

export interface Photo {
  id: string
  url: string
  caption?: string
  uploadAt: string
  uploadBy: Role
  uploadByUserId: string
  uploadByUserName: string
}

export interface Signature {
  role: Role
  name: string
  signed: boolean
  signedAt?: string
  signatureData?: string
  signedByUserId?: string
}

export interface Rectification {
  id: string
  description: string
  status: RectificationStatus
  createdAt: string
  createdBy: Role
  createdByUserId: string
  createdByUserName: string
  beforePhotos: Photo[]
  afterPhotos: Photo[]
  resolvedAt?: string
  resolvedByUserId?: string
  resolvedByUserName?: string
  verifiedAt?: string
  verifiedByUserId?: string
  verifiedByUserName?: string
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
  submittedByUserId?: string
  submittedByUserName?: string
  passedAt?: string
}

export interface Project {
  id: string
  name: string
  address: string
  nodes: AcceptanceNode[]
  ownerUserId: string
  createdAt: string
}

export interface RoleInfo {
  role: Role
  name: string
  avatar: string
}

export interface OperationLog {
  id: string
  userId: string
  userName: string
  role: Role
  action: string
  nodeId?: string
  nodeName?: string
  timestamp: string
  details?: Record<string, unknown>
}
