package tohoc.chord_o_matic.selection;

import android.os.Build;

import androidx.annotation.RequiresApi;

import java.util.Objects;

public class SongChord {

    public SongChord(String key, String suffix)
    {
        this.key = key;
        this.suffix = suffix;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SongChord songChord = (SongChord) o;
        return key.equals(songChord.key) && suffix.equals(songChord.suffix);
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    public int hashCode() {
        return Objects.hash(key+suffix);
    }

    public String key;
    public String suffix;
}
