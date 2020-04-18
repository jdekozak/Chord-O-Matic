package tohoc.chord_o_matic.selection;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import tohoc.chord_o_matic.R;

public class KeyAdapter extends RecyclerView.Adapter<KeyAdapter.KeyViewHolder>
{
    public interface OnKeyListener
    {
        void onKeyClick(int position);
    }

    public class KeyViewHolder extends RecyclerView.ViewHolder
    {
        public KeyViewHolder(View item)
        {
            super(item);
            name = (TextView) item.findViewById(R.id.key_name);
        }

        public void display(Key key)
        {
            name.setText(key.name);
        }

        private TextView name;
    }

    public KeyAdapter(List<Key> keycollection, OnKeyListener onKeyListener)
    {
        this.keycollection = keycollection;
        this.onKeyListener = onKeyListener;
    }

    @NonNull
    @Override
    public KeyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType)
    {
        keyItem = LayoutInflater.from(parent.getContext()).inflate(R.layout.key_item, parent, false);
        return new KeyViewHolder(keyItem);
    }

    @Override
    public void onBindViewHolder(@NonNull final KeyViewHolder holder, int position)
    {
        keyItem.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onKeyListener.onKeyClick(holder.getAdapterPosition());
            }
        });
        holder.display(keycollection.get(position));
    }

    @Override
    public int getItemCount()
    {
        return keycollection.size();
    }

    private List<Key> keycollection;
    private OnKeyListener onKeyListener;
    private View keyItem;
}
