import type { Project, RoleInfo } from '../types'

export const roleInfos: Record<string, RoleInfo> = {
  foreman: {
    role: 'foreman',
    name: '张工长',
    avatar: '👷',
  },
  owner: {
    role: 'owner',
    name: '李业主',
    avatar: '🏠',
  },
  supervisor: {
    role: 'supervisor',
    name: '王监理',
    avatar: '📋',
  },
}

export const mockProject: Project = {
  id: 'proj-001',
  name: '阳光花园 3栋 1802室',
  address: '北京市朝阳区阳光花园小区3号楼1802室',
  ownerUserId: 'user-owner',
  createdAt: '2024-06-01 09:00',
  nodes: [
    {
      id: 'node-1',
      name: '水电走线',
      description: '电路布线、水管铺设等隐蔽工程验收',
      icon: 'Zap',
      status: 'submitted',
      photos: [
        {
          id: 'photo-1-1',
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=interior%20home%20renovation%20electrical%20wiring%20in%20wall%20professional%20construction&image_size=square_hd',
          caption: '客厅电路布线',
          uploadAt: '2024-06-10 09:30',
          uploadBy: 'foreman',
          uploadByUserId: 'user-foreman',
          uploadByUserName: '张工长',
        },
        {
          id: 'photo-1-2',
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bathroom%20plumbing%20pipes%20water%20pipe%20installation%20construction&image_size=square_hd',
          caption: '卫生间水管铺设',
          uploadAt: '2024-06-10 09:45',
          uploadBy: 'foreman',
          uploadByUserId: 'user-foreman',
          uploadByUserName: '张工长',
        },
        {
          id: 'photo-1-3',
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kitchen%20electrical%20outlet%20wiring%20renovation%20construction&image_size=square_hd',
          caption: '厨房电路布局',
          uploadAt: '2024-06-10 10:00',
          uploadBy: 'foreman',
          uploadByUserId: 'user-foreman',
          uploadByUserName: '张工长',
        },
      ],
      signatures: [
 {
          role: 'owner',
          name: '李业主',
          signed: true,
          signedAt: '2024-06-10 14:20',
          signatureData: 'owner-signature-1',
          signedByUserId: 'user-owner',
        },
        {
          role: 'supervisor',
          name: '王监理',
          signed: false,
        },
      ],
      rectifications: [
        {
          id: 'rect-1-1',
          description: '主卧插座位置偏低，建议上移15cm以符合使用习惯',
          status: 'verified',
          createdAt: '2024-06-09 16:00',
          createdBy: 'supervisor',
          createdByUserId: 'user-supervisor',
          createdByUserName: '王监理',
          beforePhotos: [
            {
              id: 'rect-before-1',
              url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electrical%20outlet%20too%20low%20on%20wall%20problem&image_size=square_hd',
              caption: '整改前：插座位置偏低',
              uploadAt: '2024-06-09 16:00',
              uploadBy: 'supervisor',
              uploadByUserId: 'user-supervisor',
              uploadByUserName: '王监理',
            },
          ],
          afterPhotos: [
            {
              id: 'rect-after-1',
              url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electrical%20outlet%20proper%20height%20on%20wall%20fixed&image_size=square_hd',
              caption: '整改后：插座已上移',
              uploadAt: '2024-06-10 08:00',
              uploadBy: 'foreman',
              uploadByUserId: 'user-foreman',
              uploadByUserName: '张工长',
            },
          ],
          resolvedAt: '2024-06-10 08:30',
          resolvedByUserId: 'user-foreman',
          resolvedByUserName: '张工长',
          verifiedAt: '2024-06-10 09:00',
          verifiedByUserId: 'user-supervisor',
          verifiedByUserName: '王监理',
        },
      ],
      submittedAt: '2024-06-10 10:30',
      submittedByUserId: 'user-foreman',
      submittedByUserName: '张工长',
    },
    {
      id: 'node-2',
      name: '防水闭水',
      description: '卫生间、厨房防水施工及闭水试验验收',
      icon: 'Droplets',
      status: 'pending',
      photos: [],
      signatures: [
        {
          role: 'owner',
          name: '李业主',
          signed: false,
        },
        {
          role: 'supervisor',
          name: '王监理',
          signed: false,
        },
      ],
      rectifications: [],
    },
    {
      id: 'node-3',
      name: '吊顶龙骨',
      description: '吊顶龙骨安装、承重结构验收',
      icon: 'LayoutGrid',
      status: 'pending',
      photos: [],
      signatures: [
        {
          role: 'owner',
          name: '李业主',
          signed: false,
        },
        {
          role: 'supervisor',
          name: '王监理',
          signed: false,
        },
      ],
      rectifications: [],
    },
    {
      id: 'node-4',
      name: '墙面基层',
      description: '墙面找平、腻子基层处理验收',
      icon: 'Layers',
      status: 'pending',
      photos: [],
      signatures: [
        {
          role: 'owner',
          name: '李业主',
          signed: false,
        },
        {
          role: 'supervisor',
          name: '王监理',
          signed: false,
        },
      ],
      rectifications: [],
    },
  ],
}
