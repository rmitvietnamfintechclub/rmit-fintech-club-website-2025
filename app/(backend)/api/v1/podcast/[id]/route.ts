import type { NextRequest} from "next/server";
import { deletePodcast, updatePodcast, getPodcastById } from "@/app/(backend)/controllers/podcastController";


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const data = await request.json();
    return updatePodcast(params.id, data);
}
export async function DELETE(request: NextRequest,{ params} : {params: { id: string}} ){
    return deletePodcast(params.id);
}

export async function GET(request: NextRequest, {params}: {params: {id: string}}){
     return getPodcastById(params.id);
}





