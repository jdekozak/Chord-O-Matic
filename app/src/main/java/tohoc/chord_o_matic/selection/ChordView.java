package tohoc.chord_o_matic.selection;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.util.AttributeSet;
import android.view.View;

import androidx.annotation.Nullable;

import java.util.ArrayList;

public class ChordView extends View
{
    public ChordView(Context context)
    {
        super(context);
        initializeBackgroundColor();
        initializeForegroundColor();
    }

    public ChordView(Context context, @Nullable AttributeSet attrs)
    {
        super(context, attrs);
        initializeBackgroundColor();
        initializeForegroundColor();
    }

    public ChordView(Context context, @Nullable AttributeSet attrs, int defStyleAttr)
    {
        super(context, attrs, defStyleAttr);
        initializeBackgroundColor();
        initializeForegroundColor();
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom)
    {
        super.onLayout(changed, left, top, right, bottom);
        boundary.set(left, top, right, bottom);
        stringInterval = getWidth() / ((StringNumber + 1) * 1F);
        fretInterval =  getHeight() / (FretNumber * 1F);
    }

    @Override
    protected void onDraw(Canvas canvas)
    {
        super.onDraw(canvas);
        drawBackground(canvas);
        drawFretboard(canvas);
        drawChordOnFretboard(canvas);
    }

    public void setChord(int barre, char[] frets)
    {
        this.barre = barre;
        this.frets = frets;
        invalidate();
    }

    private void drawBackground(Canvas canvas)
    {
        canvas.drawRect(boundary, backgroundColor);
    }

    private int convertFretCharToInteger(char fret)
    {
        switch (fret)
        {
            case '1' : return 1;
            case '2' : return 2;
            case '3' : return 3;
            case '4' : return 4;
            case '5' : return 5;
            case '6' : return 6;
            case '7' : return 7;
            case '8' : return 8;
            case '9' : return 9;
            case 'a' : return 10;
            case 'b' : return 11;
            case 'c' : return 12;
            case 'd' : return 13;
            case 'e' : return 14;
            case 'f' : return 15;
            case 'g' : return 16;
            case 'h' : return 17;
            case 'i' : return 18;
            case 'j' : return 19;
            case 'k' : return 20;
            case 'l' : return 21;
            case 'm' : return 22;
            case 'n' : return 23;
            case 'o' : return 24;
            default : return 0;
        }
    }

    private void drawChordOnFretboard(Canvas canvas)
    {
        int maximumFret = barre;
        int minimumFret = barre;
        ArrayList<Integer> stringBarre = new ArrayList<>();
        for(int string = 1; string <= StringNumber; string++)
        {
            char fretChar = frets[string - 1];
            if(fretChar == 'x')
            {
                drawNotPlayedString(canvas, string);
                continue;
            }
            if(fretChar == '0')
            {
                drawNotFrettedString(canvas, string);
                continue;
            }

            int fret = convertFretCharToInteger(fretChar);
            if(maximumFret < fret)
            {
                maximumFret = fret;
            }
            if(minimumFret > fret)
            {
                minimumFret = fret;
            }
            if(barre == fret)
            {
                stringBarre.add(string);
            }
        }
        for(int string = 1; string <= StringNumber; string++)
        {
            char fretChar = frets[string - 1];
            if(fretChar == 'x' || fretChar == '0')
            {
                continue;
            }
            int fret = convertFretCharToInteger(fretChar);
            if(maximumFret > 4)
            {
                fret = fret - minimumFret + 1;
            }
            drawFrettedString(canvas, fret, string);
        }
        if(maximumFret <= 4)
        {
            drawFret(
                    canvas,
                    1,
                    foregroundColorThickLine);
        }
        else
        {
            canvas.drawText(
                    String.valueOf(minimumFret),
                    0.2F * stringInterval,
                    1.57F * fretInterval,
                    foregroundColor);
        }
        if(!stringBarre.isEmpty() && stringBarre.size() >= 2)
        {
            drawBarre(canvas, maximumFret > 4 ? barre - minimumFret + 1 : barre, stringBarre.get(0), stringBarre.get(stringBarre.size() -1));
        }
    }

    private void drawBarre(Canvas canvas, int fret, int fromString, int toString)
    {
        foregroundColorBarre.setStrokeWidth(fretInterval/2);
        canvas.drawLine(
                fromString*stringInterval,
                (fret+0.5F)*fretInterval,
                toString*stringInterval,
                (fret+0.5F)*fretInterval,
                foregroundColorBarre);
    }

    private void drawNotPlayedString(Canvas canvas, int string)
    {
        canvas.drawLine(
                (string-0.25F)*stringInterval,
                0.70F * fretInterval,
                (string+0.25F)*stringInterval,
                0.30F * fretInterval,
                foregroundColor);
        canvas.drawLine(
                (string-0.25F)*stringInterval,
                0.30F * fretInterval,
                (string+0.25F)*stringInterval,
                0.70F * fretInterval,
                foregroundColor);
    }

    private void drawNotFrettedString(Canvas canvas, int string)
    {
        canvas.drawCircle(
                string*stringInterval,
                0.5F*fretInterval,
                fretInterval/6 ,
                foregroundColorOutline);
    }

    private void drawFrettedString(Canvas canvas, int fret, int string)
    {
        canvas.drawCircle(
                string*stringInterval,
                (fret + 0.5F)*fretInterval,
                fretInterval/4,
                foregroundColor);
    }

    private void drawFretboard(Canvas canvas)
    {
        for(int string = 1; string <= StringNumber; string++ )
        {
            drawString(canvas, string);
        }
        for(int fret = 1; fret <= FretNumber; fret++ )
        {
            drawFret(canvas, fret, foregroundColor);
        }
    }

    private void drawString(Canvas canvas, int string)
    {
        canvas.drawLine(
                string * stringInterval,
                fretInterval,
                string * stringInterval,
                FretNumber * fretInterval,
                foregroundColor);
    }

    private void drawFret(Canvas canvas, int fret, Paint color)
    {
        canvas.drawLine(
                stringInterval,
                fret*fretInterval,
                StringNumber * stringInterval,
                fret*fretInterval,
                color);
    }

    private void initializeBackgroundColor()
    {
        backgroundColor = new Paint();
        backgroundColor.setStyle(Paint.Style.FILL);
        backgroundColor.setColor(Color.LTGRAY);
    }

    private void initializeForegroundColor()
    {
        foregroundColor = new Paint();
        foregroundColor.setColor(Color.BLACK);
        foregroundColor.setStrokeWidth(2);

        foregroundColorOutline = new Paint();
        foregroundColorOutline.setColor(Color.BLACK);
        foregroundColorOutline.setStrokeWidth(1);
        foregroundColorOutline.setStyle(Paint.Style.STROKE);

        foregroundColorThickLine = new Paint();
        foregroundColorThickLine.setColor(Color.BLACK);
        foregroundColorThickLine.setStrokeWidth(10);

        foregroundColorBarre = new Paint();
        foregroundColorBarre.setColor(Color.BLACK);
    }

    private Paint backgroundColor;
    private Paint foregroundColor;
    private Paint foregroundColorOutline;
    private Paint foregroundColorThickLine;
    private Paint foregroundColorBarre;
    private Rect boundary = new Rect();

    private float fretInterval;
    private float stringInterval;
    private static int StringNumber = 6;
    private static int FretNumber = 5;

    private int barre = 2;
    private char[] frets = {'x', '3', '2', '0', '1', '0'};
}
