import React, { useState } from 'react';
import { CommentDTO } from '../../../api/socialApi';
import { useSocialStore } from '../../../store/useSocialStore';

interface CommentListProps {
    postId: string;
    comments: CommentDTO[];
}

export const CommentList: React.FC<CommentListProps> = ({ postId, comments }) => {
    const [newComment, setNewComment] = useState('');
    const addComment = useSocialStore((state) => state.addComment);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        await addComment(postId, newComment);
        setNewComment('');
    };

    return (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
            {comments.length > 0 && (
                <div className="flex flex-col gap-3 mb-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-slate-700/30 p-3 rounded-lg flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                                {(comment.authorEmail || 'US').substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-200">
                                    {comment.authorEmail ? comment.authorEmail.split('@')[0] : 'Usuario'}
                                </p>
                                <p className="text-sm text-slate-300 mt-1">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <button 
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
};
