package tohoc.chord_o_matic.selection;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import tohoc.chord_o_matic.R;

public class SongChordAdapter extends RecyclerView.Adapter<SongChordAdapter.SongChordViewHolder>
{
    interface OnSongChordListener
    {
        void onSongChordClick(int position);
    }

    boolean hasSongChord(SongChord songChord)
    {
        return songChordCollection.contains(songChord);
    }

    void addSongChord(SongChord songChord)
    {
        songChordCollection.add(0, songChord);
        notifyItemInserted(0);
        notifyDataSetChanged();
    }

    void removeSongChord(int position)
    {
        songChordCollection.remove(position);
        notifyItemRemoved(position);
        notifyDataSetChanged();
    }

    static class SongChordViewHolder extends RecyclerView.ViewHolder
    {
        SongChordViewHolder(View item)
        {
            super(item);
            name = item.findViewById(R.id.song_chord_name);
        }

        void display(SongChord songChord)
        {
            name.setText(songChord.name);
        }

        public TextView name;
    }

    SongChordAdapter(List<SongChord> songChordCollection, OnSongChordListener onSongChordListener)
    {
        this.songChordCollection = songChordCollection;
        this.onSongChordListener = onSongChordListener;
    }

    @NonNull
    @Override
    public SongChordViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType)
    {
        songChordItem = LayoutInflater.from(parent.getContext()).inflate(R.layout.song_chord_item, parent, false);
        return new SongChordViewHolder(songChordItem);
    }

    @Override
    public void onBindViewHolder(@NonNull final SongChordViewHolder holder, int position)
    {
        songChordItem.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onSongChordListener.onSongChordClick(holder.getAdapterPosition());
            }
        });
        holder.display(songChordCollection.get(position));
    }

    @Override
    public int getItemCount()
    {
        return songChordCollection.size();
    }

    private List<SongChord> songChordCollection;
    private OnSongChordListener onSongChordListener;
    private View songChordItem;
}
