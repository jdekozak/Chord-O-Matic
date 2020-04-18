package tohoc.chord_o_matic.selection;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import tohoc.chord_o_matic.R;

public class ChordAdapter extends RecyclerView.Adapter<ChordAdapter.ChordAdapterViewHolder>
{
    public interface OnChordListener
    {
        void onChordClick(int position);
    }

    static class ChordAdapterViewHolder extends RecyclerView.ViewHolder
    {
        ChordAdapterViewHolder(View item)
        {
            super(item);

            suffix = item.findViewById(R.id.chord_suffix);
            six_strings_guitar = item.findViewById(R.id.chord_6strings_guitar);
        }

        void display(Chord chord)
        {
            suffix.setText(chord.suffix);
            six_strings_guitar.setChord(chord.barre, chord.frets);
        }

        private TextView suffix;
        private ChordView six_strings_guitar;
    }

    ChordAdapter(List<Chord> chordCollection, OnChordListener onChordListener)
    {
        this.chordCollection = chordCollection;
        this.onChordListener = onChordListener;
    }

    @NonNull
    @Override
    public ChordAdapterViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType)
    {
        chordItem = LayoutInflater.from(parent.getContext()).inflate(R.layout.chord_item, parent, false);
        return new ChordAdapterViewHolder(chordItem);
    }

    @Override
    public void onBindViewHolder(@NonNull final ChordAdapterViewHolder holder, int position)
    {
        chordItem.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onChordListener.onChordClick(holder.getAdapterPosition());
            }
        });
        holder.display(chordCollection.get(position));
    }

    @Override
    public int getItemCount()
    {
        return chordCollection.size();
    }

    private List<Chord> chordCollection;
    private OnChordListener onChordListener;
    private View chordItem;
}
