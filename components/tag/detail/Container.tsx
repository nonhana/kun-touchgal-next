'use client'

import { useEffect, useState } from 'react'
import { Pagination } from '@nextui-org/pagination'
import { kunFetchGet } from '~/utils/kunFetch'
import { Chip } from '@nextui-org/chip'
import { Button } from '@nextui-org/button'
import { useDisclosure } from '@nextui-org/modal'
import { Pencil } from 'lucide-react'
import { TagDetail } from '~/types/api/tag'
import { KunLoading } from '~/components/kun/Loading'
import { KunHeader } from '~/components/kun/Header'
import { KunMasonryGrid } from '~/components/kun/MasonryGrid'
import { useMounted } from '~/hooks/useMounted'
import { GalgameCard } from '~/components/galgame/Card'
import { motion } from 'framer-motion'
import { cardContainer, cardItem } from '~/motion/card'
import { KunNull } from '~/components/kun/Null'
import { EditTagModal } from './EditTagModel'
import { useRouter } from 'next-nprogress-bar'
import { KunUser } from '~/components/kun/floating-card/KunUser'
import { formatDistanceToNow } from '~/utils/formatDistanceToNow'
import { useUserStore } from '~/store/userStore'

interface Props {
  initialTag: TagDetail
  initialPatches: GalgameCard[]
  total: number
}

export const TagDetailCOntainer = ({
  initialTag,
  initialPatches,
  total
}: Props) => {
  const isMounted = useMounted()
  const user = useUserStore((state) => state.user)
  const router = useRouter()
  const [page, setPage] = useState(1)

  const [tag, setTag] = useState(initialTag)
  const [patches, setPatches] = useState<GalgameCard[]>(initialPatches)
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const fetchPatches = async () => {
    setLoading(true)

    const { galgames } = await kunFetchGet<{
      galgames: GalgameCard[]
      total: number
    }>('/tag/galgame', {
      tagId: tag.id,
      page,
      limit: 24
    })

    setPatches(galgames)
    setLoading(false)
  }

  useEffect(() => {
    if (!isMounted) {
      return
    }
    fetchPatches()
  }, [page])

  return (
    <div className="w-full my-4">
      <KunHeader
        name={tag.name}
        description={tag.introduction}
        headerEndContent={
          <Chip size="lg" color="primary">
            {tag.count} 个 Galgame
          </Chip>
        }
        endContent={
          <div className="flex justify-between">
            <KunUser
              user={tag.user}
              userProps={{
                name: tag.user.name,
                description: `创建于 ${formatDistanceToNow(tag.created)}`,
                avatarProps: {
                  src: tag.user?.avatar
                }
              }}
            />

            {user.role > 2 && (
              <Button
                variant="flat"
                color="primary"
                onPress={onOpen}
                startContent={<Pencil />}
              >
                编辑该标签
              </Button>
            )}
            <EditTagModal
              tag={tag}
              isOpen={isOpen}
              onClose={onClose}
              onSuccess={(newTag) => {
                setTag(newTag)
                onClose()
                router.refresh()
              }}
            />
          </div>
        }
      />

      {tag.alias.length > 0 && (
        <div className="mb-4">
          <h2 className="mb-4 text-lg font-semibold">别名</h2>
          <div className="flex flex-wrap gap-2">
            {tag.alias.map((alias, index) => (
              <Chip key={index} variant="flat" color="secondary">
                {alias}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <KunLoading hint="正在获取 Galgame 中..." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 mx-auto mb-8 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {patches.map((pa) => (
              <GalgameCard key={pa.id} patch={pa} />
            ))}
          </div>

          {total > 24 && (
            <div className="flex justify-center">
              <Pagination
                total={Math.ceil(total / 24)}
                page={page}
                onChange={(newPage: number) => {
                  setPage(newPage)
                  fetchPatches()
                }}
                showControls
                size="lg"
                radius="lg"
                classNames={{
                  wrapper: 'gap-2',
                  item: 'w-10 h-10'
                }}
              />
            </div>
          )}

          {!total && <KunNull message="这个标签暂无 Galgame 使用" />}
        </>
      )}
    </div>
  )
}
