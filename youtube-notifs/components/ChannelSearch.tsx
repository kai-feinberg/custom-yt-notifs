'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, X } from "lucide-react"

interface Channel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

export function ChannelSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Channel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/youtube/channels?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Failed to fetch channels')
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error fetching channels:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel)
    setQuery('')
    setResults([])
  }

  const handleClearSelection = () => {
    setSelectedChannel(null)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">YouTube Creator Search</h2>
          {selectedChannel ? (
            <div className="bg-gray-100 p-4 rounded-md relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleClearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedChannel.thumbnail} alt={selectedChannel.title} />
                  <AvatarFallback>{selectedChannel.title.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedChannel.title}</h3>
                </div>
              </div>
              <p className="mt-2 text-sm">{selectedChannel.description}</p>
            </div>
          ) : (
            <form onSubmit={handleSearch} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search creators..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Search'}
              </Button>
            </form>
          )}

          <div className="text-center py-4">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : results.length > 0 ? (
              <ul className="space-y-2">
                {results.map(channel => (
                  <li 
                    key={channel.id} 
                    className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => handleChannelSelect(channel)}
                  >
                    <Avatar>
                      <AvatarImage src={channel.thumbnail} alt={channel.title} />
                      <AvatarFallback>{channel.title.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{channel.title}</p>
                      <p className="text-sm text-wrap text-gray-500 truncate">{channel.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}