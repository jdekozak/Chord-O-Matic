package tohoc.chord_o_matic.ui.main;

import android.content.Context;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;

import androidx.annotation.Nullable;
import androidx.annotation.StringRes;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import tohoc.chord_o_matic.R;
import tohoc.chord_o_matic.composition.SongComposer;
import tohoc.chord_o_matic.playback.SongPlayer;
import tohoc.chord_o_matic.selection.ChordSelector;

public class SectionsPagerAdapter extends FragmentPagerAdapter implements ChordSelector.OnChordSelectorListener
{
    @StringRes
    private static final int[] TAB_TITLES = new int[]{R.string.tab_text_1, R.string.tab_text_2, R.string.tab_text_3};
    private final Context mContext;

    public SectionsPagerAdapter(Context context, FragmentManager fm)
    {
        super(fm, FragmentPagerAdapter.BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT);
        mContext = context;
    }

    @Override
    public Fragment getItem(int position)
    {
        switch(position)
        {
            case 0:
                return new ChordSelector(this);
            case 1:
                return new SongComposer();
            case 2:
                return new SongPlayer(mContext);
            default:
                return new ChordSelector(this);
        }
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position)
    {
        return mContext.getResources().getString(TAB_TITLES[position]);
    }

    @Override
    public int getCount()
    {
        return TAB_TITLES.length;
    }


    private Vibrator getVibrator()
    {
        Vibrator vibrator;
        try
        {
            vibrator = (Vibrator) mContext.getSystemService(Context.VIBRATOR_SERVICE);
        }
        catch (Exception exception)
        {
            throw exception;
        }
        return vibrator;
    }

    @Override
    public void onSuccessfulOperation()
    {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
        {
            getVibrator().vibrate(VibrationEffect.createOneShot(100, VibrationEffect.DEFAULT_AMPLITUDE));
        }
        else
        {
            getVibrator().vibrate(100);
        }
    }
}